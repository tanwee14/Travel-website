// Ginger Hotel Booking Navbar JavaScript

class GingerBooking {
  constructor() {
    this.selectedDates = {
      checkin: new Date(2025, 5, 17), // June 17, 2025
      checkout: new Date(2025, 5, 18), // June 18, 2025
    }

    this.rooms = [{ adults: 1, children: 0 }]

    this.specialCode = "none"

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.generateCalendars()
    this.updateGuestDisplay()
    this.updateDateDisplay()
  }

  setupEventListeners() {
    // Date selector click
    document.getElementById("dateSelector").addEventListener("click", () => {
      this.toggleDatePicker()
    })

    // Guest selector click
    document.getElementById("guestSelector").addEventListener("click", () => {
      this.toggleGuestModal()
    })

    // Special code dropdown click
    document.getElementById("specialCodeDropdown").addEventListener("click", () => {
      this.toggleSpecialDropdown()
    })

    // Close modals when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".date-picker-modal") && !e.target.closest("#dateSelector")) {
        this.closeDatePicker()
      }
      if (!e.target.closest(".guest-modal") && !e.target.closest("#guestSelector")) {
        this.closeGuestModal()
      }
      if (!e.target.closest(".special-dropdown-menu") && !e.target.closest("#specialCodeDropdown")) {
        this.closeSpecialDropdown()
      }
    })

    // Special dropdown items
    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        this.selectSpecialCode(e.target.closest(".dropdown-item").dataset.value)
      })
    })
  }

  toggleDatePicker() {
    const modal = document.getElementById("datePickerModal")
    modal.style.display = modal.style.display === "none" ? "block" : "none"
  }

  closeDatePicker() {
    document.getElementById("datePickerModal").style.display = "none"
  }

  toggleGuestModal() {
    const modal = document.getElementById("guestModal")
    if (modal.style.display === "none") {
      this.generateRoomsModal()
      modal.style.display = "block"
    } else {
      modal.style.display = "none"
    }
  }

  closeGuestModal() {
    document.getElementById("guestModal").style.display = "none"
  }

  toggleSpecialDropdown() {
    const menu = document.getElementById("specialDropdownMenu")
    menu.style.display = menu.style.display === "none" ? "block" : "none"
  }

  closeSpecialDropdown() {
    document.getElementById("specialDropdownMenu").style.display = "none"
  }

  selectSpecialCode(value) {
    this.specialCode = value

    // Update active state
    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.classList.remove("active")
    })
    document.querySelector(`[data-value="${value}"]`).classList.add("active")

    // Update display text
    const text =
      value === "none"
        ? "Special Code"
        : value === "corporate"
          ? "Corporate Access Code"
          : value === "travel"
            ? "Travel Agency Code"
            : "Business Connect Code"

    document.getElementById("specialCodeText").textContent = text
    this.closeSpecialDropdown()
  }

  generateCalendars() {
    this.generateCalendar("juneCalendar", 2025, 5) // June 2025
    this.generateCalendar("julyCalendar", 2025, 6) // July 2025
  }

  generateCalendar(containerId, year, month) {
    const container = document.getElementById(containerId)
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    // Clear container
    container.innerHTML = ""

    // Add day headers
    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    dayHeaders.forEach((day) => {
      const header = document.createElement("div")
      header.className = "calendar-day-header"
      header.textContent = day
      container.appendChild(header)
    })

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDay = document.createElement("div")
      emptyDay.className = "calendar-day disabled"
      container.appendChild(emptyDay)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div")
      dayElement.className = "calendar-day"

      const currentDate = new Date(year, month, day)
      const isSelected = this.isDateSelected(currentDate)
      const isInRange = this.isDateInRange(currentDate)

      if (isSelected) {
        dayElement.classList.add("selected")
      } else if (isInRange) {
        dayElement.classList.add("in-range")
      }

      dayElement.innerHTML = `
                <span>${day}</span>
                <span class="price">₹4.4K</span>
            `

      dayElement.addEventListener("click", () => {
        this.selectDate(currentDate)
      })

      container.appendChild(dayElement)
    }
  }

  isDateSelected(date) {
    return (
      date.getTime() === this.selectedDates.checkin.getTime() ||
      date.getTime() === this.selectedDates.checkout.getTime()
    )
  }

  isDateInRange(date) {
    return date > this.selectedDates.checkin && date < this.selectedDates.checkout
  }

  selectDate(date) {
    // Simple date selection logic - you can enhance this
    if (!this.selectedDates.checkin || date < this.selectedDates.checkin) {
      this.selectedDates.checkin = date
      this.selectedDates.checkout = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    } else {
      this.selectedDates.checkout = date
    }

    this.updateDateDisplay()
    this.generateCalendars()
  }

  updateDateDisplay() {
    const checkinStr = this.formatDate(this.selectedDates.checkin)
    const checkoutStr = this.formatDate(this.selectedDates.checkout)
    document.getElementById("dateText").textContent = `${checkinStr} – ${checkoutStr}`
  }

  formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${date.getDate()} ${months[date.getMonth()]}`
  }

  generateRoomsModal() {
    const container = document.getElementById("roomsContainer")
    container.innerHTML = ""

    this.rooms.forEach((room, index) => {
      const roomElement = document.createElement("div")
      roomElement.className = "room-item"
      roomElement.innerHTML = `
                <div class="room-header">
                    <span class="room-title">Room ${index + 1}</span>
                    ${this.rooms.length > 1 ? `<button class="room-close" onclick="booking.removeRoom(${index})">×</button>` : ""}
                </div>
                <div class="guest-controls">
                    <div class="guest-type">
                        <div class="guest-type-header">
                            <span class="guest-type-label">${room.adults} Adult${room.adults !== 1 ? "s" : ""}</span>
                        </div>
                        <div class="guest-counter">
                            <button class="counter-btn" onclick="booking.updateGuests(${index}, 'adults', -1)" ${room.adults <= 1 ? "disabled" : ""}>−</button>
                            <span class="counter-value">${room.adults}</span>
                            <button class="counter-btn" onclick="booking.updateGuests(${index}, 'adults', 1)">+</button>
                        </div>
                    </div>
                    <div class="guest-type">
                        <div class="guest-type-header">
                            <span class="guest-type-label">${room.children} Child${room.children !== 1 ? "" : ""}</span>
                            <span class="guest-type-subtitle">(0 - 12 yrs)</span>
                        </div>
                        <div class="guest-counter">
                            <button class="counter-btn" onclick="booking.updateGuests(${index}, 'children', -1)" ${room.children <= 0 ? "disabled" : ""}>−</button>
                            <span class="counter-value">${room.children}</span>
                            <button class="counter-btn" onclick="booking.updateGuests(${index}, 'children', 1)">+</button>
                        </div>
                    </div>
                </div>
            `
      container.appendChild(roomElement)
    })

    // Add room button if less than 4 rooms
    if (this.rooms.length < 4) {
      const addRoomBtn = document.createElement("button")
      addRoomBtn.className = "btn btn-outline-primary btn-sm mt-2"
      addRoomBtn.textContent = "Add Room"
      addRoomBtn.onclick = () => this.addRoom()
      container.appendChild(addRoomBtn)
    }
  }

  updateGuests(roomIndex, type, change) {
    if (type === "adults") {
      this.rooms[roomIndex].adults = Math.max(1, this.rooms[roomIndex].adults + change)
    } else {
      this.rooms[roomIndex].children = Math.max(0, this.rooms[roomIndex].children + change)
    }

    this.updateGuestDisplay()
    this.generateRoomsModal()
  }

  addRoom() {
    if (this.rooms.length < 4) {
      this.rooms.push({ adults: 1, children: 0 })
      this.updateGuestDisplay()
      this.generateRoomsModal()
    }
  }

  removeRoom(index) {
    if (this.rooms.length > 1) {
      this.rooms.splice(index, 1)
      this.updateGuestDisplay()
      this.generateRoomsModal()
    }
  }

  updateGuestDisplay() {
    const totalGuests = this.rooms.reduce((sum, room) => sum + room.adults + room.children, 0)
    const totalRooms = this.rooms.length

    const guestText = `${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}, ${totalRooms} Room${totalRooms !== 1 ? "s" : ""}`
    document.getElementById("guestText").textContent = guestText
  }
}

// Initialize the booking system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.booking = new GingerBooking()
})
