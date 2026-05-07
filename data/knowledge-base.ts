export type KnowledgeItem = {
  id: string;
  type: "about" | "project" | "faq" | "donation" | "volunteer" | "internship" | "contact" | "update";
  title: string;
  content: string;
  tags: string[];
  locale?: "en" | "hi" | "ta";
};

export const foundationKnowledge: KnowledgeItem[] = [
  {
    id: "about-foundation",
    type: "about",
    title: "About Amaanitvam Foundation",
    content:
      "Amaanitvam Foundation is a community-focused NGO working to improve access to education, mentorship, social awareness, and dignified support for underserved families. The foundation believes that practical learning, compassionate service, and youth participation can create measurable local impact.",
    tags: ["about", "foundation", "ngo", "mission"]
  },
  {
    id: "mission-vision",
    type: "about",
    title: "Mission and Vision",
    content:
      "Mission: enable children, youth, and families to access education, guidance, and opportunities with dignity. Vision: build self-reliant communities where every person can learn, contribute, and grow without barriers caused by poverty or lack of support.",
    tags: ["mission", "vision", "values", "impact"]
  },
  {
    id: "project-shiksha",
    type: "project",
    title: "Project Shiksha",
    content:
      "Shiksha is an education initiative that supports children through learning resources, tutoring, digital literacy, school readiness, and confidence-building activities. Volunteers can help with subject mentoring, reading sessions, career exposure, and resource drives.",
    tags: ["shiksha", "education", "children", "learning", "school"]
  },
  {
    id: "project-manthan",
    type: "project",
    title: "Project Manthan",
    content:
      "Manthan is a dialogue and mentorship initiative focused on awareness, leadership, emotional wellbeing, and community problem-solving. It includes workshops, youth circles, career conversations, and social-impact discussions.",
    tags: ["manthan", "mentorship", "workshop", "awareness", "youth"]
  },
  {
    id: "donations",
    type: "donation",
    title: "Donations",
    content:
      "Supporters can contribute funds, books, stationery, devices, clothes in good condition, or sponsor learning kits. The safest process is to contact the foundation team, confirm the current needs, and request official donation details before transferring money.",
    tags: ["donate", "donation", "support", "sponsor", "contribute"]
  },
  {
    id: "volunteering",
    type: "volunteer",
    title: "Volunteering",
    content:
      "Volunteers can teach, mentor, design posters, manage social media, organize donation drives, conduct surveys, help with events, and support documentation. New volunteers should share their skills, location, availability, and preferred project.",
    tags: ["volunteer", "join", "help", "teach", "mentor"]
  },
  {
    id: "internships",
    type: "internship",
    title: "Internship Opportunities",
    content:
      "Internship roles may include full-stack development, content writing, graphic design, social media, field coordination, fundraising, research, documentation, and community outreach. Applicants should send a resume, portfolio if available, interests, and expected duration.",
    tags: ["internship", "career", "resume", "developer", "student"]
  },
  {
    id: "contact",
    type: "contact",
    title: "Contact and Help",
    content:
      "For volunteering, donations, internships, partnerships, or urgent help, contact the Amaanitvam Foundation team through their official phone, email, website, or social media handles. If exact contact details are not configured, ask the user to provide preferred contact information so the team can follow up.",
    tags: ["contact", "help", "email", "phone", "partnership"]
  },
  {
    id: "faq-documents",
    type: "faq",
    title: "FAQ: Certificates and Documents",
    content:
      "Volunteers and interns can request certificates after completing assigned work and submitting required reports or proof of contribution. Exact certificate rules should be confirmed with the admin team.",
    tags: ["faq", "certificate", "documents", "intern"]
  },
  {
    id: "faq-language",
    type: "faq",
    title: "FAQ: Languages",
    content:
      "The assistant can respond in English, Hindi, and Tamil. Users may ask questions in any supported language and can switch language from the chat interface.",
    tags: ["faq", "language", "hindi", "tamil", "english"]
  },
  {
    id: "faq-volunteer-registration",
    type: "faq",
    title: "FAQ: How do I register as a volunteer?",
    content:
      "To register as a volunteer, share your name, contact details, location, skills, preferred project, and weekly availability with the foundation team. The team can then guide you toward suitable activities such as teaching, mentoring, content support, drives, or event assistance.",
    tags: ["faq", "volunteer", "registration", "join", "availability"]
  },
  {
    id: "faq-donation-process",
    type: "faq",
    title: "FAQ: How can I donate safely?",
    content:
      "Before donating money or materials, contact the official foundation team and confirm the current requirements. Donors should use only verified payment details or approved collection points and may request an acknowledgement or receipt after contributing.",
    tags: ["faq", "donation", "donate", "safe", "receipt"]
  },
  {
    id: "faq-internship-application",
    type: "faq",
    title: "FAQ: How do I apply for an internship?",
    content:
      "Internship applicants should send their resume, area of interest, relevant portfolio or work samples if available, preferred duration, and expected weekly availability. Common areas include development, content writing, design, social media, research, fundraising, and community outreach.",
    tags: ["faq", "internship", "apply", "resume", "portfolio"]
  },
  {
    id: "faq-project-selection",
    type: "faq",
    title: "FAQ: Which project should I join?",
    content:
      "People interested in teaching, tutoring, reading, or digital learning can explore Project Shiksha. People interested in mentoring, awareness sessions, leadership, emotional wellbeing, workshops, or youth discussions can explore Project Manthan.",
    tags: ["faq", "project", "shiksha", "manthan", "join"]
  },
  {
    id: "faq-time-commitment",
    type: "faq",
    title: "FAQ: How much time do volunteers need to give?",
    content:
      "Volunteer time commitments can be flexible and depend on the activity. Some people may help for a few hours during events or drives, while regular mentors or interns may commit weekly hours for a defined period after discussing availability with the team.",
    tags: ["faq", "time", "availability", "volunteer", "commitment"]
  },
  {
    id: "faq-remote-support",
    type: "faq",
    title: "FAQ: Can I support remotely?",
    content:
      "Remote support may be possible for tasks such as content writing, poster design, social media support, documentation, research, digital mentoring, and technical work. Field-based activities, events, and donation drives may require local presence.",
    tags: ["faq", "remote", "online", "support", "volunteer"]
  },
  {
    id: "faq-partnerships",
    type: "faq",
    title: "FAQ: Can schools, colleges, or companies partner with the foundation?",
    content:
      "Schools, colleges, companies, and community groups can discuss partnerships for workshops, donation drives, volunteering programs, awareness sessions, internships, or project support. Interested organizations should share their goals, location, audience, and proposed timeline.",
    tags: ["faq", "partnership", "school", "college", "company"]
  }
];

export const suggestedPrompts = [
  "How can I volunteer?",
  "Tell me about Shiksha",
  "How can I donate?",
  "What internships are available?",
  "Explain Project Manthan",
  "How do I contact the team?"
];
