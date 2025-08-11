import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ForumCard from '../Forum/ForumCard/ForumCard';

// Mock navigation
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
        'Posted:': 'Posted:',
        'No tags': 'No tags'
      };
      return translations[key] || key;
    }
  })
}));

// Mock API endpoints
vi.mock('../config/api.js', () => ({
  API_ENDPOINTS: {
    LIKE_ACTION: (postId, action) => `http://localhost:5001/api/v1/post/${postId}/${action}`
  }
}));

// Mock image imports
vi.mock('../assets/Comments.png', () => ({
  default: 'mock-comments-icon.png'
}));

vi.mock('../assets/Likes.png', () => ({
  default: 'mock-likes-icon.png'
}));

vi.mock('../assets/Unlikes.png', () => ({
  default: 'mock-unlikes-icon.png'
}));

// Mock fetch globally
global.fetch = vi.fn();

const mockActionButton = vi.fn(() => <button data-testid="action-button">Action</button>);

const defaultProps = {
  postId: 'test-post-id',
  postUser: 'Test User',
  postDate: '2024-01-01',
  postTitle: 'Test Post Title',
  postTags: ['Tag1', 'Tag2'],
  postDescription: 'This is a test post description',
  ActionButton: mockActionButton,
  postComment: 5,
  postLikes: 10,
  postMedia: [],
  initiallyLiked: false,
  initialBookmarked: false
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ForumCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ likes: 11 })
    });
  });

  it('should render all basic post information', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Posted:')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('This is a test post description')).toBeInTheDocument();
  });

  it('should render post tags correctly', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
  });

  it('should render "No tags" when no tags provided', () => {
    const propsWithoutTags = { ...defaultProps, postTags: [] };
    renderWithRouter(<ForumCard {...propsWithoutTags} />);
    
    expect(screen.getByText('No tags')).toBeInTheDocument();
  });

  it('should render stats correctly', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    // Check comments count
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check likes count
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Check icons
    const commentsIcon = screen.getByAltText('comments');
    expect(commentsIcon).toBeInTheDocument();
    
    const likesIcon = screen.getByAltText('likes');
    expect(likesIcon).toBeInTheDocument();
  });

  it('should render Action Button component', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
    expect(mockActionButton).toHaveBeenCalled();
  });

  it('should apply correct CSS classes', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    const postDiv = document.querySelector('.post');
    expect(postDiv).toBeInTheDocument();
    
    const postTitle = document.querySelector('.postTitle');
    expect(postTitle).toBeInTheDocument();
    expect(postTitle.textContent).toBe('Test Post Title');
    
    const postDescription = document.querySelector('.postDescription');
    expect(postDescription).toBeInTheDocument();
    
    const stats = document.querySelector('.stats');
    expect(stats).toBeInTheDocument();
  });

  it('should navigate to viewpost when clicked', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    const postDiv = document.querySelector('.post');
    fireEvent.click(postDiv);
    
    expect(mockNavigate).toHaveBeenCalledWith(
      '/forum/viewpost?postId=test-post-id',
      {
        state: {
          bookmarked: false,
          liked: false
        }
      }
    );
  });

  it('should handle like toggle functionality', async () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    const likesDiv = document.querySelector('.likesNumber');
    expect(likesDiv).toBeInTheDocument();
    
    fireEvent.click(likesDiv);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/v1/post/test-post-id/like',
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    });
  });

  it('should handle unlike when already liked', async () => {
    const likedProps = { ...defaultProps, initiallyLiked: true };
    renderWithRouter(<ForumCard {...likedProps} />);
    
    const likesDiv = document.querySelector('.likesNumber');
    fireEvent.click(likesDiv);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/v1/post/test-post-id/unlike',
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );
    });
  });

  it('should prevent navigation when clicking on like button', async () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    const likesDiv = document.querySelector('.likesNumber');
    fireEvent.click(likesDiv);
    
    // Navigation should not be called when clicking likes
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render post media when provided', () => {
    const propsWithMedia = {
      ...defaultProps,
      postMedia: [
        { url: 'image1.jpg' },
        { url: 'image2.jpg' }
      ]
    };
    
    renderWithRouter(<ForumCard {...propsWithMedia} />);
    
    const postImagesDiv = document.querySelector('.postImagesDiv');
    expect(postImagesDiv).toBeInTheDocument();
    
    const images = document.querySelectorAll('.postImage');
    expect(images).toHaveLength(2);
    
    expect(images[0]).toHaveAttribute('src', 'image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'image2.jpg');
  });

  it('should not render media section when no media provided', () => {
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    const postImagesDiv = document.querySelector('.postImagesDiv');
    expect(postImagesDiv).not.toBeInTheDocument();
  });

  it('should handle API error during like toggle', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    const likesDiv = document.querySelector('.likesNumber');
    fireEvent.click(likesDiv);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error toggling like:', 'API Error');
    });
    
    consoleSpy.mockRestore();
  });

  it('should update like count after successful like', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ likes: 11 })
    });
    
    renderWithRouter(<ForumCard {...defaultProps} />);
    
    // Initial like count
    expect(screen.getByText('10')).toBeInTheDocument();
    
    const likesDiv = document.querySelector('.likesNumber');
    fireEvent.click(likesDiv);
    
    await waitFor(() => {
      expect(screen.getByText('11')).toBeInTheDocument();
    });
  });

  it('should handle props changes correctly', () => {
    const { rerender } = renderWithRouter(<ForumCard {...defaultProps} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    
    const newProps = { ...defaultProps, postTitle: 'Updated Title' };
    
    rerender(
      <BrowserRouter>
        <ForumCard {...newProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
  });

  it('should encode post ID in navigation URL', () => {
    const propsWithSpecialId = { ...defaultProps, postId: 'test id with spaces' };
    renderWithRouter(<ForumCard {...propsWithSpecialId} />);
    
    const postDiv = document.querySelector('.post');
    fireEvent.click(postDiv);
    
    expect(mockNavigate).toHaveBeenCalledWith(
      '/forum/viewpost?postId=test%20id%20with%20spaces',
      expect.any(Object)
    );
  });

  it('should handle missing or undefined props gracefully', () => {
    const minimalProps = {
      postId: 'test-id',
      ActionButton: mockActionButton
    };
    
    renderWithRouter(<ForumCard {...minimalProps} />);
    
    // Should render without crashing
    const postDiv = document.querySelector('.post');
    expect(postDiv).toBeInTheDocument();
  });
});
