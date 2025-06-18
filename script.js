// Hotel Booking Card Functionality

class GingerBooking {
  constructor() {
    const today = new Date()
    this.selectedDates = {
      checkin: new Date(today),
  checkout: new Date(today.getTime() + 24 * 60 * 60 * 1000), // June 18, 2025
    }
    this.selectionPhase = "checkin";
    this.currentYear = today.getFullYear()
    this.currentMonth = today.getMonth()
    this.rooms = [{ adults: 1, children: 0 }]


    this.init()
  }

  init() {
    this.setupEventListeners()
    this.generateCalendars()
    this.updateGuestDisplay()
    this.updateDateDisplay()
    
    this.initializeCheckboxes()
   
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

    // Close modals when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".date-picker-modal") && !e.target.closest("#dateSelector")) {
        this.closeDatePicker()
      }
      if (!e.target.closest(".guest-modal") && !e.target.closest("#guestSelector")) {
        this.closeGuestModal()
      }
    })

    
  }

  //Header Functionality
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

  // Add empty cells before the 1st of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement("div")
    emptyDay.className = "calendar-day disabled"
    container.appendChild(emptyDay)
  }

  // Add actual days
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
initializeCalendar() {
  const today = new Date()
  this.currentYear = today.getFullYear()
  this.currentMonth = today.getMonth()
  const checkin = new Date(today.getFullYear(), today.getMonth(), today.getDate())
const checkout = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

this.selectedDates = {
  checkin,
  checkout
}

  this.generateCalendars()

  document.getElementById("prevMonth").addEventListener("click", () => {
    if (this.currentMonth > 0) {
      this.currentMonth--
    } else {
      this.currentMonth = 11
      this.currentYear--
    }
    this.generateCalendars()
  })

  document.getElementById("nextMonth").addEventListener("click", () => {
    if (this.currentMonth < 11) {
      this.currentMonth++
    } else {
      this.currentMonth = 0
      this.currentYear++
    }
    this.generateCalendars()
  })
}

  generateCalendars() {
  const leftMonth = this.currentMonth
  const rightMonth = this.currentMonth + 1
  const year = this.currentYear

  // Update headers
  document.getElementById("leftMonthHeader").textContent = 
    `${this.getMonthName(leftMonth)} ${year}`
  document.getElementById("rightMonthHeader").textContent = 
    `${this.getMonthName(rightMonth)} ${rightMonth > 11 ? year + 1 : year}`

  // Handle year rollover
  this.generateCalendar("leftCalendar", year, leftMonth)
  if (rightMonth > 11) {
    this.generateCalendar("rightCalendar", year + 1, 0)
  } else {
    this.generateCalendar("rightCalendar", year, rightMonth)
  }
}
getMonthName(monthIndex) {
  return new Date(2000, monthIndex).toLocaleString("default", { month: "long" })
}


  isDateSelected(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const checkin = new Date(this.selectedDates.checkin.getFullYear(), this.selectedDates.checkin.getMonth(), this.selectedDates.checkin.getDate())
  const checkout = new Date(this.selectedDates.checkout.getFullYear(), this.selectedDates.checkout.getMonth(), this.selectedDates.checkout.getDate())

  return d.getTime() === checkin.getTime() || d.getTime() === checkout.getTime()
}


  isDateInRange(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const checkin = new Date(this.selectedDates.checkin.getFullYear(), this.selectedDates.checkin.getMonth(), this.selectedDates.checkin.getDate())
  const checkout = new Date(this.selectedDates.checkout.getFullYear(), this.selectedDates.checkout.getMonth(), this.selectedDates.checkout.getDate())

  return d > checkin && d < checkout
}


  selectDate(date) {
    // Simple date selection logic
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
    const checkoutStr = this.selectedDates.checkout
  ? this.formatDate(this.selectedDates.checkout)
  : "Select date"

    document.getElementById("dateText").textContent = `${checkinStr} – ${checkoutStr}`
  }

  formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${date.getDate()} ${months[date.getMonth()]}`
  }
  handlePrevMonth() {
  if (this.currentMonth === 0) {
    this.currentMonth = 11
    this.currentYear -= 1
  } else {
    this.currentMonth -= 1
  }
  this.generateCalendars()
}

handleNextMonth() {
  if (this.currentMonth === 11) {
    this.currentMonth = 0
    this.currentYear += 1
  } else {
    this.currentMonth += 1
  }
  this.generateCalendars()
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

  
  // Checkbox functionality
  initializeCheckboxes() {
    const showTaxesCheckbox = document.getElementById("showTaxes")

    if (showTaxesCheckbox) {
      showTaxesCheckbox.addEventListener("change", function () {
        const label = this.nextElementSibling
        if (this.checked) {
          label.style.fontWeight = "600"
          label.style.color = "#333"
        } else {
          label.style.fontWeight = "normal"
          label.style.color = "#6c757d"
        }
      })
    }
  }
}

// Rate Details Modal Function
function openRateDetailsModal(rateTitle) {
  const modal = document.getElementById("rateDetailsModal")
  const modalTitle = modal.querySelector(".rate-details-title")

  // Update modal title based on clicked rate
  modalTitle.textContent = rateTitle || "Best Available Rate Room Only"

  // Show modal using Bootstrap
  const bsModal = window.bootstrap.Modal.getOrCreateInstance(modal)
  bsModal.show()
}

// Image Gallery Modal Function
function openImageGallery() {
  const modal = document.getElementById("imageGalleryModal")
  const bsModal = window.bootstrap.Modal.getOrCreateInstance(modal)
  bsModal.show()
}

// Change Gallery Image Function
function changeGalleryImage(imageSrc) {
  const mainImage = document.getElementById("galleryMainImage")
  const thumbnails = document.querySelectorAll(".thumbnail")

  mainImage.src = imageSrc

  // Update active thumbnail
  thumbnails.forEach((thumb) => thumb.classList.remove("active"))
  event.target.classList.add("active")
}




// Footer functionality
function subscribeNewsletter() {
  const email = document.getElementById("subscriptionEmail").value

  if (!email) {
    alert("Please enter your email address")
    return
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address")
    return
  }

  // Simulate subscription process
  alert("Thank you for subscribing! You will receive our latest updates.")
  document.getElementById("subscriptionEmail").value = ""
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function toggleDestinations() {
  const content = document.getElementById("destinationsContent")
  const toggle = document.getElementById("destinationsToggle")

  if (content.style.display === "none") {
    content.style.display = "block"
    toggle.classList.add("rotated")
    toggle.classList.remove("fa-plus")
    toggle.classList.add("fa-minus")
  } else {
    content.style.display = "none"
    toggle.classList.remove("rotated")
    toggle.classList.remove("fa-minus")
    toggle.classList.add("fa-plus")
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  window.booking = new GingerBooking()
  //Event Listner for Calendar
  
  document.getElementById("prevMonth").addEventListener("click", () => {
  window.booking.handlePrevMonth()
})

document.getElementById("nextMonth").addEventListener("click", () => {
  window.booking.handleNextMonth()
})
  // View More Rates functionality
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-more-btn")) {
      e.preventDefault()
      showNotification("Loading more rates...", "info")

      // Simulate loading more rates
      setTimeout(() => {
        showNotification("More rates loaded successfully!", "success")
      }, 1500)
    }
  })

  // Room details links
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("room-details-link") || e.target.classList.contains("rate-details-link")) {
      e.preventDefault()
      showNotification("Opening room details...", "info")
    }

    // Rate details links
    if (e.target.classList.contains("rate-details-link")) {
      e.preventDefault()
      const rateOption = e.target.closest(".rate-option")
      const rateTitle = rateOption.querySelector(".rate-title").textContent
      openRateDetailsModal(rateTitle)
    }
  })

  // Sidebar accordion functionality
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-chevron-up") || e.target.classList.contains("fa-chevron-down")) {
      const icon = e.target
      const section = icon.closest(".sidebar-section")
      const content = section.querySelector(".room-config, .not-selected")

      if (icon.classList.contains("fa-chevron-up")) {
        icon.classList.remove("fa-chevron-up")
        icon.classList.add("fa-chevron-down")
        if (content) content.style.display = "none"
      } else {
        icon.classList.remove("fa-chevron-down")
        icon.classList.add("fa-chevron-up")
        if (content) content.style.display = "block"
      }
    }
  })

  // Newsletter subscription enter key support
  const subscriptionInput = document.getElementById("subscriptionEmail")
  if (subscriptionInput) {
    subscriptionInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        subscribeNewsletter()
      }
    })
  }
})

// Show/hide back to top button based on scroll position
window.addEventListener("scroll", () => {
  const backToTopBtn = document.getElementById("backToTop")
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add("show")
  } else {
    backToTopBtn.classList.remove("show")
  }
})



// Price data for different accommodation types
const accommodationPrices = {
  "room-only": { price: 3500, label: "Room Only" },
  "room-breakfast": { price: 4200, label: "Room With Breakfast" },
  "room-all-meals": { price: 7800, label: "Room With All MJ Meal" },
  "room-bf-meal": { price: 5500, label: "Room With B/F & 1 MJ Meal" },
}

// Function to show notifications
function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}
  

// Function to update sidebar
function updateSidebar(roomName, price) {
  console.log(`Sidebar updated with room: ${roomName} and price: ₹${price}`)
}

// Update price based on accommodation selection
function updatePrice(accommodationType) {
  const priceData = accommodationPrices[accommodationType]
  const priceAmountElement = document.getElementById("priceAmount")

  if (priceData && priceAmountElement) {
    priceAmountElement.textContent = `₹${priceData.price.toLocaleString("en-IN")}`

    // Update date (you can modify this logic as needed)
    const priceDateElement = document.getElementById("priceDate")
    if (priceDateElement) {
      const today = new Date()
      const formattedDate = today.toLocaleDateString("en-GB")
      priceDateElement.textContent = formattedDate
    }

    // Show notification
    showNotification(`Price updated to ${priceData.label}: ₹${priceData.price.toLocaleString("en-IN")}`, "success")
  }
}

// Change main image when thumbnail is clicked
function changeMainImage(imageSrc) {
  const mainImage = document.querySelector(".main-image")
  if (mainImage) {
    mainImage.src = imageSrc

    // Add fade effect
    mainImage.style.opacity = "0.7"
    setTimeout(() => {
      mainImage.style.opacity = "1"
    }, 200)
  }
}

// Handle booking button click
function handleBooking() {
  const selectedAccommodation = document.getElementById("accommodationSelect").value
  const priceData = accommodationPrices[selectedAccommodation]

  if (priceData) {
    showNotification(`Booking ${priceData.label} for ₹${priceData.price.toLocaleString("en-IN")}`, "info")

    // Update sidebar with selected room
    updateSidebar("Super Deluxe Room", priceData.price.toString())

    // You can add more booking logic here
    setTimeout(() => {
      showNotification("Redirecting to booking confirmation...", "success")
    }, 1500)
  }
}

// Initialize the room card functionality
document.addEventListener("DOMContentLoaded", () => {
  // Set initial price
  updatePrice("room-all-meals")

  // Add hover effects to thumbnails
  const thumbnails = document.querySelectorAll(".room-thumbnail")
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)"
    })

    thumbnail.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
    })
  })
})


// Global variables for image gallery
let currentImageIndex = 0
const galleryImages = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?fm=jpg&q=60&w=3000",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?fm=jpg&q=60&w=3000",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?fm=jpg&q=60&w=3000",
]

// Rate Details Modal Functions
function openRateDetailsModal(rateTitle = "Best Available Rate Room Only") {
  const overlay = document.getElementById("rateDetailsOverlay")
  const titleElement = document.getElementById("rateModalTitle")

  if (titleElement) {
    titleElement.textContent = rateTitle
  }

  overlay.style.display = "flex"
  document.body.style.overflow = "hidden" // Prevent background scrolling

  // Add animation
  setTimeout(() => {
    overlay.style.opacity = "1"
  }, 10)
}

function closeRateDetailsModal() {
  const overlay = document.getElementById("rateDetailsOverlay")
  overlay.style.display = "none"
  document.body.style.overflow = "auto" // Restore scrolling
}

// Room Details Modal Functions
function openRoomDetailsModal() {
  const overlay = document.getElementById("roomDetailsOverlay")
  overlay.style.display = "flex"
  document.body.style.overflow = "hidden"

  // Add animation
  setTimeout(() => {
    overlay.style.opacity = "1"
  }, 10)
}

function closeRoomDetailsModal() {
  const overlay = document.getElementById("roomDetailsOverlay")
  overlay.style.display = "none"
  document.body.style.overflow = "auto"
}

// Image Gallery Modal Functions
function openImageGallery(startIndex = 0) {
  const overlay = document.getElementById("imageGalleryOverlay")
  currentImageIndex = startIndex

  updateGalleryImage()
  overlay.style.display = "flex"
  document.body.style.overflow = "hidden"

  // Add keyboard navigation
  document.addEventListener("keydown", handleGalleryKeyboard)
}

function closeImageGallery() {
  const overlay = document.getElementById("imageGalleryOverlay")
  overlay.style.display = "none"
  document.body.style.overflow = "auto"

  // Remove keyboard navigation
  document.removeEventListener("keydown", handleGalleryKeyboard)
}

function changeGalleryImage(thumbnailElement, imageSrc) {
  const mainImage = document.getElementById("galleryCurrentImage")
  const thumbnails = document.querySelectorAll(".thumbnail-item")

  // Update main image
  mainImage.src = imageSrc

  // Update active thumbnail
  thumbnails.forEach((thumb) => thumb.classList.remove("active"))
  thumbnailElement.classList.add("active")

  // Update current index
  currentImageIndex = Array.from(thumbnails).indexOf(thumbnailElement)
  updateImageCounter()
}

function updateGalleryImage() {
  const mainImage = document.getElementById("galleryCurrentImage")
  const thumbnails = document.querySelectorAll(".thumbnail-item")

  if (galleryImages[currentImageIndex]) {
    mainImage.src = galleryImages[currentImageIndex]

    // Update active thumbnail
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle("active", index === currentImageIndex)
    })

    updateImageCounter()
  }
}

function updateImageCounter() {
  const counter = document.getElementById("imageCounter")
  if (counter) {
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`
  }
}

function handleGalleryKeyboard(e) {
  switch (e.key) {
    case "Escape":
      closeImageGallery()
      break
    case "ArrowLeft":
      if (currentImageIndex > 0) {
        currentImageIndex--
        updateGalleryImage()
      }
      break
    case "ArrowRight":
      if (currentImageIndex < galleryImages.length - 1) {
        currentImageIndex++
        updateGalleryImage()
      }
      break
  }
}

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    if (e.target.id === "rateDetailsOverlay") {
      closeRateDetailsModal()
    } else if (e.target.id === "roomDetailsOverlay") {
      closeRoomDetailsModal()
    } else if (e.target.id === "imageGalleryOverlay") {
      closeImageGallery()
    }
  }
})

// Update existing functions to use new modals
function openImageModal(imageSrc) {
  // Find the index of the clicked image
  const imageIndex = galleryImages.findIndex((img) => img === imageSrc)
  openImageGallery(imageIndex >= 0 ? imageIndex : 0)
}

// Initialize modal functionality
document.addEventListener("DOMContentLoaded", () => {
  // Update existing rate details links
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("rate-details-link")) {
      e.preventDefault()
      const rateOption = e.target.closest(".rate-option") || e.target.closest(".pricing-section")
      const rateTitle = rateOption
        ? rateOption.querySelector(".rate-title")?.textContent || "Rate Details"
        : "Rate Details"
      openRateDetailsModal(rateTitle)
    }

    if (e.target.classList.contains("room-details-link")) {
      e.preventDefault()
      openRoomDetailsModal()
    }
  })
})





