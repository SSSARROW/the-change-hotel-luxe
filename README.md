# The Change Hotel · Luxe

A four-page static website for The Change Hotel, Kandy, Sri Lanka: home, rooms and dining, gallery, and contact.

- Plain HTML, CSS and a little JavaScript. No build step: open `index.html` or serve the folder with any static host.
- `shared/site.js` handles the booking widget (date and guest estimate), the mobile menu, the photo viewer and the contact form.
- `shared/motion.css` and `shared/motion.js` add the page and scroll transitions. They switch off for visitors who prefer reduced motion.

## Before going live

- The booking bar and contact form do not make real bookings. They show an estimate (about LKR 17,000 a night, from one Agoda quote) and open WhatsApp with a prefilled message to `94777403921`. Confirm that number is on WhatsApp, or change `data-whatsapp` and the `wa.me` links.
- Room details and rates are from public listings and should be confirmed with the hotel.
- Photos in `img/` come from the hotel's Google Maps listing. Get the owner's permission, or replace them with the hotel's own photos, before publishing.
- Guest reviews are paraphrased summaries of public Google and Tripadvisor reviews, credited by first name and initial.
