/**
 * Shared, template-agnostic content shapes. This is a JavaScript project, so
 * these JSDoc typedefs stand in for TypeScript types. Runtime validation is
 * enforced by the Zod schemas in `src/content/schema.js`.
 *
 * @typedef {Object} Social
 * @property {string} label
 * @property {string} url
 * @property {string} [handle]
 *
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} role
 * @property {string} tagline
 * @property {string} avatar
 * @property {string[]} [avatars]
 * @property {string} location
 * @property {string} email
 * @property {string} resumeUrl
 * @property {string} [availability]
 * @property {string} bio
 * @property {Social[]} socials
 *
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string} description
 * @property {string[]} tags
 * @property {string} [coverImage]
 * @property {string} [liveUrl]
 * @property {string} [repoUrl]
 * @property {boolean} [featured]
 * @property {string} [date]
 *
 * @typedef {Object} Skill
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} proficiency
 * @property {string} [icon]
 *
 * @typedef {Object} ExperienceItem
 * @property {string} id
 * @property {string} company
 * @property {string} role
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {string} [summary]
 * @property {string[]} bullets
 *
 * @typedef {Object} SeoData
 * @property {string} title
 * @property {string} description
 * @property {string} [ogImage]
 * @property {string} [twitterHandle]
 * @property {string} siteUrl
 *
 * @typedef {Object} PortfolioContent
 * @property {Profile} profile
 * @property {Project[]} projects
 * @property {Skill[]} skills
 * @property {ExperienceItem[]} experience
 * @property {SeoData} seo
 */

export {}
