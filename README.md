# The Change Hotel · Luxe

A four-page static website for The Change Hotel, Kandy, Sri Lanka.

| Page | File |
|---|---|
| Home (hero with booking bar, reviews, gallery preview, map) | `index.html` |
| Rooms and dining | `rooms.html` |
| Gallery (click a photo to enlarge) | `gallery.html` |
| Contact (booking form, message form, map) | `contact.html` |

It is plain HTML, CSS and a little JavaScript. There is no build step and nothing to install.

## How to run it

You need nothing but a web browser.

### Option 1: open the file

1. Download or clone this repo:
   ```bash
   git clone https://github.com/SSSARROW/the-change-hotel-luxe.git
   cd the-change-hotel-luxe
   ```
2. Double-click `index.html`, or run `open index.html` (macOS) or `start index.html` (Windows).

Most things work this way. The page-to-page fade needs a local server (Option 2), and the embedded map can behave differently when a page is opened straight from disk.

### Option 2: run a local server (recommended)

From inside the project folder, use whichever you have:

```bash
# Python 3
python3 -m http.server 8000

# or Node.js
npx serve .
```

Then open <http://localhost:8000>. Press `Ctrl+C` in the terminal to stop it.

### Option 3: put it online

Upload the folder to any static host, such as GitHub Pages, Netlify or Cloudflare Pages. For GitHub Pages: repo **Settings → Pages → Deploy from a branch → `main` / root**.

## Project layout

```
index.html  rooms.html  gallery.html  contact.html   the four pages
style.css                                            all styling (colours are CSS variables at the top)
img/                                                 photos
shared/site.js                                       booking widget, mobile menu, photo viewer, contact form
shared/motion.css, motion.js                         page and scroll transitions
shared/lightbox.css                                  photo viewer styling
```

## How things work

- **Booking bar:** picks dates and guests and shows an estimate. It does not make a real booking. It opens WhatsApp with the dates and guests already written. The nightly rate is set by `NIGHTLY_RATE` at the top of `shared/site.js`.
- **Contact form:** checks the fields, then opens WhatsApp with the message ready to send. The number is the `data-whatsapp` attribute on the form in `contact.html`.
- **Map:** a Google Maps embed in `index.html` and `contact.html`. Change the coordinates in the iframe `src` to move the pin.
- **Transitions:** soft page fades (Chrome, Edge, recent Safari) and scroll-in animations. They switch off for visitors who prefer reduced motion.

## Before going live

- **WhatsApp:** the number `94777403921` comes from the hotel's public listing. Confirm it is on WhatsApp, or change `data-whatsapp` in `contact.html` and the `wa.me` links in `shared/site.js`.
- **Room details and rates:** taken from public listings (about LKR 17,000 a night, from one Agoda quote). Confirm them with the hotel.
- **Photos:** the files in `img/` come from the hotel's Google Maps listing. Get the owner's permission, or replace them with the hotel's own photos.
- **Reviews:** paraphrased summaries of public Google and Tripadvisor reviews, credited by first name and initial. They are not word-for-word quotes.
