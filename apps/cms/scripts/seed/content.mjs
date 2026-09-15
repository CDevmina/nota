/**
 * The homepage's content, as data.
 *
 * Transcribed from the reference site. Keeping it here rather than typing it
 * into the admin panel means the content is version-controlled, reviewable as a
 * diff, and reproducible against any Strapi instance — a database wipe costs
 * one command instead of an evening.
 *
 * This seeds the *initial* state only. Once loaded, everything here is editable
 * in the admin panel like any other content; nothing reads this file at runtime.
 *
 * `media` values are filenames, resolved to uploaded Strapi media IDs by
 * index.mjs. A filename with no matching file is left null and the section
 * renders without it.
 */

export const siteSettings = {
  headerLinks: [
    { label: 'Specifications', href: '#specifications', isExternal: false },
    { label: "Who it's for", href: '#who-its-for', isExternal: false },
    { label: 'About', href: '#about', isExternal: false },
    { label: 'Inside the box', href: '#inside-the-box', isExternal: false },
  ],
  cta: {
    label: 'Order',
    productName: 'Nota One',
    price: 300,
    currency: '$',
  },
  orderModal: {
    title: 'Stay ahead',
    description: 'Launching soon. Get early access and insider updates',
    emailPlaceholder: 'E-mail',
    submitLabel: 'Notify me •',
    closeLabel: 'Close',
    successMessage: "All set. We'll keep you posted",
    errorMessage: 'Something went wrong! Try again',
    requiredMessage: 'This field is required',
  },
  footerTagline:
    'NŌTA creates tools that respect the way people think and write. Natural handwriting, quietly connected to digital structure.',
  footerNavTitle: 'Navigation',
  footerLinks: [
    { label: 'Specifications', href: '#specifications', isExternal: false },
    { label: "Who it's for", href: '#who-its-for', isExternal: false },
    { label: 'About', href: '#about', isExternal: false },
    { label: 'Inside the box', href: '#inside-the-box', isExternal: false },
  ],
  yearLabel: 'Year',
  year: '2026',
  copyright: '@2026 Nōta Team',
  credits: [
    { label: 'Made in Taptop', href: 'https://taptop.pro/' },
    { label: 'Builded by NōtaTeam', href: null },
    { label: 'Designed by Alice', href: 'https://www.behance.net/alicem' },
    { label: '& UPROCK Studio', href: 'https://www.uprock.ru/' },
  ],
  marqueeText: 'Made in Taptop',
};

export const homepage = {
  seo: {
    metaTitle: 'NŌTA | Writing Infrastructure for Modern Thinking',
    metaDescription:
      'A smart pen for real thinking. Natural handwriting on smart paper, quietly connected to digital structure.',
    ogImage: 'og-image.jpg',
    canonicalUrl: null,
    // The design belongs to UPROCK Studio. The brief requires this stay on.
    noindex: true,
  },

  sections: [
    {
      __component: 'sections.preloader',
      anchorId: null,
      durationMs: 1400,
      suffix: '%',
    },

    {
      __component: 'sections.hero',
      anchorId: 'top',
      headlineTop: 'Smart pen',
      headlineBottom: 'for real thinking',
      // 75 frames extracted from the reference's Lottie, scrubbed by scroll.
      // frame = round(progress * 74).
      frames: [
        'hero-frame-00.webp', 'hero-frame-01.webp', 'hero-frame-02.webp', 'hero-frame-03.webp', 'hero-frame-04.webp',
        'hero-frame-05.webp', 'hero-frame-06.webp', 'hero-frame-07.webp', 'hero-frame-08.webp', 'hero-frame-09.webp',
        'hero-frame-10.webp', 'hero-frame-11.webp', 'hero-frame-12.webp', 'hero-frame-13.webp', 'hero-frame-14.webp',
        'hero-frame-15.webp', 'hero-frame-16.webp', 'hero-frame-17.webp', 'hero-frame-18.webp', 'hero-frame-19.webp',
        'hero-frame-20.webp', 'hero-frame-21.webp', 'hero-frame-22.webp', 'hero-frame-23.webp', 'hero-frame-24.webp',
        'hero-frame-25.webp', 'hero-frame-26.webp', 'hero-frame-27.webp', 'hero-frame-28.webp', 'hero-frame-29.webp',
        'hero-frame-30.webp', 'hero-frame-31.webp', 'hero-frame-32.webp', 'hero-frame-33.webp', 'hero-frame-34.webp',
        'hero-frame-35.webp', 'hero-frame-36.webp', 'hero-frame-37.webp', 'hero-frame-38.webp', 'hero-frame-39.webp',
        'hero-frame-40.webp', 'hero-frame-41.webp', 'hero-frame-42.webp', 'hero-frame-43.webp', 'hero-frame-44.webp',
        'hero-frame-45.webp', 'hero-frame-46.webp', 'hero-frame-47.webp', 'hero-frame-48.webp', 'hero-frame-49.webp',
        'hero-frame-50.webp', 'hero-frame-51.webp', 'hero-frame-52.webp', 'hero-frame-53.webp', 'hero-frame-54.webp',
        'hero-frame-55.webp', 'hero-frame-56.webp', 'hero-frame-57.webp', 'hero-frame-58.webp', 'hero-frame-59.webp',
        'hero-frame-60.webp', 'hero-frame-61.webp', 'hero-frame-62.webp', 'hero-frame-63.webp', 'hero-frame-64.webp',
        'hero-frame-65.webp', 'hero-frame-66.webp', 'hero-frame-67.webp', 'hero-frame-68.webp', 'hero-frame-69.webp',
        'hero-frame-70.webp', 'hero-frame-71.webp', 'hero-frame-72.webp', 'hero-frame-73.webp', 'hero-frame-74.webp',
      ],
      media: {
        image: 'hero-frame-00.webp',
        alt: 'The NŌTA smart pen, nib downward, on a grey gradient',
        mobileImage: 'hero-pen-mobile.png',
        poster: 'hero-frame-00.webp',
      },
    },

    {
      __component: 'sections.specifications',
      anchorId: 'specifications',
      eyebrow: 'Nota pen',
      title: 'Specifications',
      media: { image: 'spec-nib.png', alt: 'Close-up of the fountain pen nib' },
      groups: [
        {
          title: 'Writing System',
          items: [
            { label: 'Fountain pen nib' },
            { label: 'Natural ink flow' },
            { label: 'Replaceable fountain-pen ink cartridge' },
            { label: 'Designed for precise, expressive handwriting' },
          ],
        },
        {
          title: 'Capture Technology',
          items: [
            { label: 'High-precision optical tracking' },
            { label: 'Real-time stroke capture' },
            { label: 'Line-by-line accuracy' },
            { label: 'Supports handwriting, diagrams, sketches' },
          ],
        },
        {
          title: 'Digital Continuity',
          items: [
            { label: 'Notes sync automatically' },
            { label: 'Searchable over time' },
            { label: 'Structured with ai support' },
            { label: 'Ready when you return' },
          ],
        },
      ],
    },

    {
      __component: 'sections.manifesto',
      anchorId: null,
      body: 'Some thoughts need time, space, and a physical trace to exist. Writing by hand creates focus, presence, and a deeper connection with ideas. This tool is built around that simple truth.',
      showRule: true,
    },

    {
      __component: 'sections.audience',
      anchorId: 'who-its-for',
      label: "WHO IT'S FOR:",
      intro: [
        {
          paragraph:
            'This tool is made for people who think on paper. It keeps handwriting natural and focused, letting you write the way you always have without distractions or screens getting in the way.',
        },
        {
          paragraph:
            'Everything you write syncs to the app, where your notes are organized, searchable, and ready to work with AI when you need more clarity or structure.',
        },
      ],
      items: [
        {
          title: 'Students & Learners',
          body: 'Handwritten notes stay personal and intuitive, but become searchable, organized, and easy to study. Lectures, ideas, and revisions are captured as they are — then supported by AI summaries, text recognition, and quick navigation when it matters most.',
          indentLevel: 0,
        },
        {
          title: 'Creators, Designers & Architects',
          body: "Sketches, diagrams, concepts, and fragments of ideas belong on paper. This tool makes sure they don't disappear. Everything drawn or written is safely stored, easy to revisit, and ready to evolve into something bigger — without interrupting the creative flow.",
          indentLevel: 1,
        },
        {
          title: 'Managers & Product Thinkers',
          body: 'Meetings start on paper and end with structure. Notes turn into clear summaries, tasks, and follow-ups. The pen captures everything quietly, while the app helps organize decisions without pulling attention away from the room.',
          indentLevel: 2,
        },
      ],
    },

    {
      __component: 'sections.transition',
      anchorId: 'about',
      lineTop: 'Works with',
      lineBottom: 'smart paper',
      mutedColor: '#666666',
      theme: 'light',
    },

    {
      __component: 'sections.features',
      anchorId: null,
      slides: [
        {
          headlineTop: 'We use special paper',
          headlineMiddle: 'with a nearly invisible',
          headlineBottom: 'pattern',
          cardTitle: "For the pen, it's a precise map",
          cardBody:
            'The pattern defines exact coordinates across the page, allowing the pen to capture every stroke with precision and consistency. For you, it feels like ordinary paper. For the system, it becomes a stable reference that turns handwriting into structured, accurate digital data.',
          media: { image: 'feature-1.jpg', mobileImage: 'feature-1-mobile.jpg', alt: 'A closed smart paper notebook' },
        },
        {
          headlineTop: 'Looks like paper.',
          headlineMiddle: null,
          headlineBottom: 'Works like a system.',
          cardTitle: "For you, it's just a blank sheet",
          cardBody:
            'You write freely, without grids, guides, or visible markers. The paper feels clean and familiar, keeping your focus on ideas instead of tools. Nothing distracts you from the act of writing. Nothing changes in how you write — only what becomes possible after.',
          media: { image: 'feature-2.jpg', mobileImage: 'feature-2-mobile.jpg', alt: 'An open notebook showing a blank page' },
        },
        {
          headlineTop: 'No delays. No glitches.',
          headlineMiddle: null,
          headlineBottom: 'No random effects.',
          cardTitle: 'AI-powered structure',
          cardBody:
            'Handwriting is processed in real time and enriched quietly in the background. AI recognizes text, structure, and context to organize notes, highlight key ideas, and connect thoughts over time. The technology stays invisible, so your focus remains fully on writing.',
          media: { image: 'feature-3.jpg', mobileImage: 'feature-3-mobile.jpg', alt: 'A notebook page with a handwritten to-do list' },
        },
        {
          headlineTop: 'Everything you write is synced',
          headlineMiddle: null,
          headlineBottom: 'to your phone in real time',
          cardTitle: 'Your notes. Already there.',
          cardBody:
            'Every note is instantly transferred to your device and safely stored in your personal space. Access your thoughts anytime, organize them effortlessly, and continue working across devices. Your handwriting becomes part of a system that is searchable, structured, and always available.',
          media: { image: 'feature-4.jpg', mobileImage: 'feature-4-mobile.jpg', alt: 'A phone showing the NŌTA app' },
        },
      ],
    },

    {
      __component: 'sections.inside-box',
      anchorId: 'inside-the-box',
      titleTop: 'Inside',
      titleBottom: 'the box',
      subtitle: 'A complete, ready-to-use set',
      description:
        'Smart pen, Smartpaper notepad, charging cable, and instructions — carefully packaged for a hassle-free start.',
      longCopy:
        'A precision smart pen with a solid aluminum body, designed for natural handwriting and accurate digital capture. Seamlessly connects to smart paper, translating every stroke into structured digital data — no screens, no distractions, just writing.',
      boxMedia: { image: 'inside-box.jpg', alt: 'The NŌTA box and its contents' },
      products: [
        {
          title: 'The NŌTA Smart Pen',
          body: 'Aluminum body, USB-C charging, physical control button, and Bluetooth connectivity. Up to 8 hours of active use with a lightweight, balanced design for everyday writing.',
          media: { image: 'product-pen.jpg', alt: 'The NŌTA smart pen' },
        },
        {
          title: 'Charging Adapter',
          body: 'Compact USB-C power adapter with stable output for everyday charging. Designed for safe, efficient power delivery with minimal heat.',
          media: { image: 'product-adapter.jpg', alt: 'The USB-C charging adapter' },
        },
      ],
      tags: [
        { label: 'Flush-fit precision cap', media: { image: 'tag-cap.jpg', alt: 'The pen cap seated flush with the body' } },
        { label: 'Refined colors. Personal expression', media: { image: 'tag-colors.jpg', alt: 'Pens in several colourways' } },
        { label: 'Durable metal nib, low-profile control button', media: { image: 'tag-nib.jpg', alt: 'The metal nib and control button' } },
        { label: 'Aluminum body', media: { image: 'tag-body.jpg', alt: 'The machined aluminium body' } },
      ],
    },

    {
      __component: 'sections.colorways',
      anchorId: null,
      items: [
        {
          name: 'Impossible to',
          tagline: 'overthink',
          gradientStart: '#b8bcc2',
          gradientEnd: '#7d838c',
          textColor: '#ffffff',
          media: { image: 'colorway-silver.jpg', alt: 'The pen in silver' },
        },
        {
          name: 'Graphite Black.',
          tagline: 'Clarity in silence.',
          gradientStart: '#1a1a1c',
          gradientEnd: '#3a3d42',
          textColor: '#ffffff',
          media: { image: 'colorway-black.jpg', alt: 'The pen in graphite black' },
        },
        {
          name: 'Mist Blue.',
          tagline: 'Light thinking.',
          gradientStart: '#2b3a5c',
          gradientEnd: '#8fa3cc',
          textColor: '#ffffff',
          media: { image: 'colorway-blue.jpg', alt: 'The pen in mist blue' },
        },
        {
          name: 'Precision Red.',
          tagline: 'Form follows thought.',
          gradientStart: '#5c1a1a',
          gradientEnd: '#b8352e',
          textColor: '#ffffff',
          media: { image: 'colorway-red.jpg', alt: 'The pen in precision red' },
        },
        {
          name: 'Bright Orange.',
          tagline: 'Steady focus.',
          gradientStart: '#6b3a7a',
          gradientEnd: '#d4622a',
          // The reference switches to a plum headline on the orange state.
          textColor: '#3a1a2a',
          media: { image: 'colorway-orange.jpg', alt: 'The pen in bright orange' },
        },
      ],
    },
  ],
};
