import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Splashscreen from '../../Splashscreen/Splashscreen';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'A collaboration between SUTD & Lion Befrienders': 'A collaboration between SUTD & Lion Befrienders',
                'im': 'im',
                'Connected': 'Connected',
                'A supportive platform for caregivers and care recipients': 'A supportive platform for caregivers and care recipients',
                'Sign Up': 'Sign Up',
                'Log In': 'Log In',
                'Services we provide:': 'Services we provide:'
            };
            return translations[key] || key;
        }
    })
}));

// Mock image imports
vi.mock('../../assets/HeartLogo.png', () => ({
    default: 'mock-heart-logo.png'
}));

vi.mock('../../assets/AIChatUI.png', () => ({
    default: 'mock-ai-chat-ui.png'
}));

vi.mock('../../assets/MedicationUI.png', () => ({
    default: 'mock-medication-ui.png'
}));

vi.mock('../../assets/ForumUI.png', () => ({
    default: 'mock-forum-ui.png'
}));

vi.mock('../../assets/PillboxIconSplashscreen.png', () => ({
    default: 'mock-pillbox-icon.png'
}));

vi.mock('../../assets/ChatbotIconSplashscreen.png', () => ({
    default: 'mock-chatbot-icon.png'
}));

vi.mock('../../assets/ForumIconSplashscreen.png', () => ({
    default: 'mock-forum-icon.png'
}));

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Splashscreen Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the splashscreen with header and main content', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check main structure
        const splashScreen = document.querySelector('.splash-screen');
        expect(splashScreen).toBeInTheDocument();
        
        const header = document.querySelector('.splash-header');
        expect(header).toBeInTheDocument();
        
        const servicesSection = document.querySelector('.services-section');
        expect(servicesSection).toBeInTheDocument();
    });

    it('should render header content correctly', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check sponsor text
        expect(screen.getByText('A collaboration between SUTD & Lion Befrienders')).toBeInTheDocument();
        
        // Check logo text
        expect(screen.getByText('im')).toBeInTheDocument();
        expect(screen.getByText('Connected')).toBeInTheDocument();
        
        // Check tagline
        expect(screen.getByText('A supportive platform for caregivers and care recipients')).toBeInTheDocument();
        
        // Check heart logo
        const heartLogo = screen.getByAltText('Heart logo');
        expect(heartLogo).toBeInTheDocument();
        expect(heartLogo).toHaveClass('heart-logo');
    });

    it('should render navigation buttons with correct links', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check Sign Up button
        const signUpButton = screen.getByText('Sign Up');
        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveClass('top-button', 'signup-btn');
        
        const signUpLink = signUpButton.closest('a');
        expect(signUpLink).toHaveAttribute('href', '/signup');
        
        // Check Log In button
        const logInButton = screen.getByText('Log In');
        expect(logInButton).toBeInTheDocument();
        expect(logInButton).toHaveClass('top-button', 'signin-btn');
        
        const logInLink = logInButton.closest('a');
        expect(logInLink).toHaveAttribute('href', '/login');
    });

    it('should render services section with title', () => {
        renderWithRouter(<Splashscreen />);
        
        expect(screen.getByText('Services we provide:')).toBeInTheDocument();
        
        const servicesTitle = screen.getByText('Services we provide:');
        expect(servicesTitle).toHaveClass('services-title');
    });

    it('should render all three service cards', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check Medication Logging card
        expect(screen.getByText('Medication Logging')).toBeInTheDocument();
        expect(screen.getByText('Track daily medications and scan prescriptions for instructions')).toBeInTheDocument();
        
        // Check AI Chat Companion card
        expect(screen.getByText('AI Chat Companion')).toBeInTheDocument();
        expect(screen.getByText('Get emotional support, summaries, translations and resource info')).toBeInTheDocument();
        
        // Check Caregiver Forum card
        expect(screen.getByText('Caregiver Forum')).toBeInTheDocument();
        expect(screen.getByText('Join discussions and share your experiences with other caregivers')).toBeInTheDocument();
    });

    it('should render service icons correctly', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check service icons
        const medicationIcon = screen.getByAltText('Medication Logging icon');
        expect(medicationIcon).toBeInTheDocument();
        expect(medicationIcon).toHaveClass('service-icon');
        
        const aiChatIcon = screen.getByAltText('AI Chat Companion icon');
        expect(aiChatIcon).toBeInTheDocument();
        expect(aiChatIcon).toHaveClass('service-icon');
        
        const forumIcon = screen.getByAltText('Caregiver Forum icon');
        expect(forumIcon).toBeInTheDocument();
        expect(forumIcon).toHaveClass('service-icon');
    });

    it('should have AI Chat Companion selected by default', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check that AI Chat card has active class
        const aiChatCard = screen.getByText('AI Chat Companion').closest('.service-card');
        expect(aiChatCard).toHaveClass('ai-card-shadow', 'active');
        
        // Check that the AI Chat UI is displayed
        const selectedUI = screen.getByAltText('AI Chat Companion UI');
        expect(selectedUI).toBeInTheDocument();
    });

    it('should change selected service when clicking on service cards', () => {
        renderWithRouter(<Splashscreen />);
        
        // Initially AI Chat should be selected
        let aiChatCard = screen.getByText('AI Chat Companion').closest('.service-card');
        expect(aiChatCard).toHaveClass('active');
        
        // Click on Medication Logging card
        const medicationCard = screen.getByText('Medication Logging').closest('.service-card');
        fireEvent.click(medicationCard);
        
        // Check that Medication card is now active
        expect(medicationCard).toHaveClass('med-card-shadow', 'active');
        
        // Check that AI Chat card is no longer active
        aiChatCard = screen.getByText('AI Chat Companion').closest('.service-card');
        expect(aiChatCard).not.toHaveClass('active');
        
        // Check that Medication UI is now displayed
        const medicationUI = screen.getByAltText('Medication Logging UI');
        expect(medicationUI).toBeInTheDocument();
    });

    it('should switch between all three services correctly', () => {
        renderWithRouter(<Splashscreen />);
        
        // Click on Forum card
        const forumCard = screen.getByText('Caregiver Forum').closest('.service-card');
        fireEvent.click(forumCard);
        
        // Check that Forum card is active
        expect(forumCard).toHaveClass('forum-card-shadow', 'active');
        expect(screen.getByAltText('Caregiver Forum UI')).toBeInTheDocument();
        
        // Click on Medication card
        const medicationCard = screen.getByText('Medication Logging').closest('.service-card');
        fireEvent.click(medicationCard);
        
        // Check that Medication card is active
        expect(medicationCard).toHaveClass('med-card-shadow', 'active');
        expect(screen.getByAltText('Medication Logging UI')).toBeInTheDocument();
        
        // Click on AI Chat card
        const aiChatCard = screen.getByText('AI Chat Companion').closest('.service-card');
        fireEvent.click(aiChatCard);
        
        // Check that AI Chat card is active
        expect(aiChatCard).toHaveClass('ai-card-shadow', 'active');
        expect(screen.getByAltText('AI Chat Companion UI')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to service cards', () => {
        renderWithRouter(<Splashscreen />);
        
        const medicationCard = screen.getByText('Medication Logging').closest('.service-card');
        expect(medicationCard).toHaveClass('service-card', 'med-card-shadow');
        
        const aiChatCard = screen.getByText('AI Chat Companion').closest('.service-card');
        expect(aiChatCard).toHaveClass('service-card', 'ai-card-shadow', 'active');
        
        const forumCard = screen.getByText('Caregiver Forum').closest('.service-card');
        expect(forumCard).toHaveClass('service-card', 'forum-card-shadow');
    });

    it('should have correct grid structure for services', () => {
        renderWithRouter(<Splashscreen />);
        
        const servicesGrid = document.querySelector('.services-grid');
        expect(servicesGrid).toBeInTheDocument();
        
        const cardsGrid = document.querySelector('.cards-grid');
        expect(cardsGrid).toBeInTheDocument();
        
        const serviceDisplay = document.querySelector('.service-display');
        expect(serviceDisplay).toBeInTheDocument();
        
        // Check that all service cards are in the cards grid
        const serviceCards = cardsGrid.querySelectorAll('.service-card');
        expect(serviceCards).toHaveLength(3);
    });

    it('should handle header structure correctly', () => {
        renderWithRouter(<Splashscreen />);
        
        const headerLeft = document.querySelector('.header-left');
        expect(headerLeft).toBeInTheDocument();
        
        const headerRight = document.querySelector('.header-right');
        expect(headerRight).toBeInTheDocument();
        
        const logoRow = document.querySelector('.logo-row');
        expect(logoRow).toBeInTheDocument();
        
        const headerButtons = document.querySelector('.header-buttons');
        expect(headerButtons).toBeInTheDocument();
    });

    it('should render with correct inline styles', () => {
        renderWithRouter(<Splashscreen />);
        
        const splashScreen = document.querySelector('.splash-screen');
        expect(splashScreen).toHaveStyle({
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        });
    });

    it('should handle multiple rapid clicks on service cards', () => {
        renderWithRouter(<Splashscreen />);
        
        const medicationCard = screen.getByText('Medication Logging').closest('.service-card');
        const forumCard = screen.getByText('Caregiver Forum').closest('.service-card');
        
        // Rapid clicks
        fireEvent.click(medicationCard);
        fireEvent.click(forumCard);
        fireEvent.click(medicationCard);
        fireEvent.click(forumCard);
        
        // Should end up with forum card selected
        expect(forumCard).toHaveClass('active');
        expect(medicationCard).not.toHaveClass('active');
        expect(screen.getByAltText('Caregiver Forum UI')).toBeInTheDocument();
    });

    it('should use translation keys correctly', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check that all translated text appears
        expect(screen.getByText('A collaboration between SUTD & Lion Befrienders')).toBeInTheDocument();
        expect(screen.getByText('im')).toBeInTheDocument();
        expect(screen.getByText('Connected')).toBeInTheDocument();
        expect(screen.getByText('A supportive platform for caregivers and care recipients')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByText('Services we provide:')).toBeInTheDocument();
    });

    it('should handle component mounting and unmounting', () => {
        const { unmount } = renderWithRouter(<Splashscreen />);
        
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
        
        // Should not throw when unmounting
        expect(() => unmount()).not.toThrow();
    });

    it('should maintain service data structure', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check that all three services are rendered with correct data
        const serviceCards = document.querySelectorAll('.service-card');
        expect(serviceCards).toHaveLength(3);
        
        // Each card should have title, description, and icon
        serviceCards.forEach(card => {
            expect(card.querySelector('h3')).toBeInTheDocument();
            expect(card.querySelector('p')).toBeInTheDocument();
            expect(card.querySelector('.service-icon')).toBeInTheDocument();
        });
    });

    it('should handle service selection state correctly', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check initial state
        const aiChatCard = screen.getByText('AI Chat Companion').closest('.service-card');
        expect(aiChatCard).toHaveClass('active');
        
        // Only one card should be active at a time
        const allCards = document.querySelectorAll('.service-card');
        const activeCards = document.querySelectorAll('.service-card.active');
        expect(activeCards).toHaveLength(1);
        
        // Click different card
        const medicationCard = screen.getByText('Medication Logging').closest('.service-card');
        fireEvent.click(medicationCard);
        
        // Still only one active card
        const newActiveCards = document.querySelectorAll('.service-card.active');
        expect(newActiveCards).toHaveLength(1);
        expect(medicationCard).toHaveClass('active');
        expect(aiChatCard).not.toHaveClass('active');
    });

    it('should render accessible content', () => {
        renderWithRouter(<Splashscreen />);
        
        // Check for semantic HTML elements
        const header = document.querySelector('header');
        expect(header).toBeInTheDocument();
        
        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
        
        // Check for proper heading hierarchy
        const h1 = document.querySelector('h1');
        expect(h1).toBeInTheDocument();
        
        const h2 = document.querySelector('h2');
        expect(h2).toBeInTheDocument();
        
        const h3Elements = document.querySelectorAll('h3');
        expect(h3Elements).toHaveLength(3);
        
        // Check for alt text on images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            expect(img).toHaveAttribute('alt');
        });
    });
});
