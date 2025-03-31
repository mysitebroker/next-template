"use client"

import { useState } from "react"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

export function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [showSuccess, setShowSuccess] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      alert('Please fill out all fields')
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    // Show success message (mock submission)
    setShowSuccess(true)
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 5000)
  }
  
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-start">
      <div className="bg-card rounded-lg p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="your.email@example.com"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="What's this about?"
              value={formState.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Your message here..."
              value={formState.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Send Message
            </button>
          </div>
          
          {showSuccess && (
            <div className="p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <div className="flex items-center">
                <Icons.check className="h-4 w-4 mr-2" />
                <span>Your message has been sent successfully!</span>
              </div>
            </div>
          )}
        </form>
      </div>
      
      <div className="space-y-8">
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-full">
              <Icons.location className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Our Headquarters</h4>
              <p className="text-sm text-muted-foreground mt-1">
                123 Tennis Court Lane<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-full">
              <Icons.clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Support Hours</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Monday - Friday: 24 hours<br />
                Saturday - Sunday: 9am - 6pm EST
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-full">
              <Icons.info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Additional Contact Methods</h4>
              <div className="text-sm text-muted-foreground mt-1 space-y-2">
                <p>
                  <span className="font-medium">Email:</span> support@tennispro.com
                </p>
                <p>
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
                <div className="pt-2">
                  <span className="font-medium">Follow Us:</span>
                  <div className="flex space-x-2 mt-2">
                    <Link
                      href={siteConfig.links.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-muted p-2 hover:bg-muted/80"
                    >
                      <Icons.twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                    <Link
                      href={siteConfig.links.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-muted p-2 hover:bg-muted/80"
                    >
                      <Icons.instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
