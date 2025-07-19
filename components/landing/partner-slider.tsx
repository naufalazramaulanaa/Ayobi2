"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const partners = [
  // **PASTIKAN SEMUA FILE LOGO INI ADA DI FOLDER `public` ANDA**
  { name: "Google", logo: "/google.png" },
  { name: "Microsoft", logo: "/microsoft.jpg" },
  { name: "Meta", logo: "/meta.png" }, // Pastikan ini .png jika aslinya .png, atau .jpg jika .jpg
  { name: "Tesla", logo: "/tesla.png" },
  // Jika Anda ingin slider berfungsi (geser kiri/kanan), tambahkan lebih banyak partner di sini:
  // { name: "Amazon", logo: "/amazon.png" }, // Contoh tambahan
  // { name: "Apple", logo: "/apple.png" },   // Contoh tambahan
  // { name: "Netflix", logo: "/netflix.png" }, // Contoh tambahan
  // { name: "Spotify", logo: "/spotify.png" }, // Contoh tambahan
]

const stats = [
  { number: "50K+", label: "Students Enrolled" },
  { number: "1K+", label: "Expert Instructors" },
  { number: "500+", label: "Premium Courses" },
  { number: "98%", label: "Success Rate" },
]

export function PartnerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Number of partners to show per slide
  const desktopVisiblePartners = 4; // Display 4 partners on desktop
  const mobileVisiblePartners = 2; // Display 2 partners on mobile

  // Auto-play functionality
 useEffect(() => {
    // Only auto-play if there are more partners than can be displayed at once on desktop
    // This makes the slider only auto-play if it's actually "sliding"
    if (!isAutoPlaying || partners.length <= desktopVisiblePartners) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, partners.length]); 

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + partners.length) % partners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Determine if navigation buttons are needed
  const showDesktopNavigation = partners.length > desktopVisiblePartners;
  const showMobileNavigation = partners.length > mobileVisiblePartners;


  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-midnight-blue-800 mb-2">{stat.number}</div>
              <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partner Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-midnight-blue-800 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of professionals who have advanced their careers with courses from top companies
          </p>
        </div>

        {/* Partner Slider */}
        <div
          className="relative overflow-hidden"
          // Only enable mouse hover pause if slider is actually active
          onMouseEnter={showDesktopNavigation ? () => setIsAutoPlaying(false) : undefined}
          onMouseLeave={showDesktopNavigation ? () => setIsAutoPlaying(true) : undefined}
        >
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {/* Previous Button - Only show if navigation is needed */}
            {showDesktopNavigation && (
              <Button variant="outline" size="icon" onClick={prevSlide} className="shrink-0 hover:bg-midnight-blue-50">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            {/* Partner Logos Container */}
            <div className={`flex items-center justify-center flex-1 ${showDesktopNavigation ? "space-x-12" : "gap-12"}`}>
              {/* Loop to display the correct number of partners for desktop */}
              {Array.from({ length: Math.min(partners.length, desktopVisiblePartners) }).map((_, i) => {
                const partnerIndex = (currentIndex + i) % partners.length
                const partner = partners[partnerIndex]
                return (
                  <div
                    key={partnerIndex}
                    className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[150px] h-20"
                  >
                    {/* Menggunakan partner.logo dari array partners */}
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      // Adjust max-h/max-w and object-contain for optimal logo fitting
                      className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )
              })}
            </div>

            {/* Next Button - Only show if navigation is needed */}
            {showDesktopNavigation && (
              <Button variant="outline" size="icon" onClick={nextSlide} className="shrink-0 hover:bg-midnight-blue-50">
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex items-center justify-center space-x-6 mb-6">
              {/* Loop to display the correct number of partners for mobile */}
              {Array.from({ length: Math.min(partners.length, mobileVisiblePartners) }).map((_, i) => {
                const partnerIndex = (currentIndex + i) % partners.length
                const partner = partners[partnerIndex]
                return (
                  <div
                    key={partnerIndex}
                    className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm min-w-[120px] h-16"
                  >
                    {/* Menggunakan partner.logo dari array partners */}
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-10 max-w-full object-contain filter grayscale"
                    />
                  </div>
                )
              })}
            </div>

            {/* Mobile Dots Navigation - Only show if navigation is needed */}
            {showMobileNavigation && (
              <div className="flex justify-center space-x-2">
                {/* Dots should represent all available partners, not just visible ones */}
                {partners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentIndex % partners.length ? "bg-midnight-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}