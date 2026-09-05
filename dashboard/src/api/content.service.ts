import { mockAbout, mockContact, mockHero, mockHighlights, mockSettings, mockSocial } from '../mocks/data'
import { createCrudService, createSingletonService } from './storage'

export const heroService = createSingletonService('content/hero', mockHero)
export const aboutService = createSingletonService('content/about', mockAbout)
export const highlightsService = createCrudService('admin/statistics', mockHighlights)
export const contactService = createSingletonService('contact', mockContact)
export const socialService = createSingletonService('social-links', mockSocial)
export const settingsService = createSingletonService('settings', mockSettings)
