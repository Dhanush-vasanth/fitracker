import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, AccessTime, Person } from '@mui/icons-material';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  @media (max-width: 480px) {
    font-size: 22px;
    gap: 8px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 450px;
  margin: 16px 0;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text_secondary};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid ${({ theme }) => theme.text_secondary + '30'};
  border-radius: 12px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
  @media (max-width: 480px) {
    padding: 12px 14px 12px 44px;
    font-size: 13px;
  }
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
`;

const CategoryChip = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${({ active, theme }) => active ? `
    background: ${theme.primary};
    color: white;
  ` : `
    background: ${theme.text_secondary + '20'};
    color: ${theme.text_primary};
    &:hover {
      background: ${theme.text_secondary + '40'};
    }
  `}
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding-bottom: 40px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const VideoCard = styled.a`
  text-decoration: none;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.card || theme.bg};
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 40px ${({ theme }) => theme.primary + '20'};
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Duration = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.green || '#4CAF50'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
`;

const VideoInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 480px) {
    padding: 12px;
    gap: 8px;
  }
`;

const VideoTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: 1.4;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const CategoryTag = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme }) => theme.primary + '20'};
  color: ${({ theme }) => theme.primary};
`;

// Sample tutorial data with YouTube videos
const TUTORIALS = [
  {
    id: 1,
    title: "Full Body Workout - No Equipment Needed",
    author: "JEFIT",
    duration: "20:15",
    category: "Full Body",
    thumbnail: "https://img.youtube.com/vi/UBMk30rjy0o/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=UBMk30rjy0o",
    completed: false
  },
  {
    id: 2,
    title: "10 Min Perfect Abs Workout",
    author: "JEFIT",
    duration: "10:00",
    category: "Core",
    thumbnail: "https://img.youtube.com/vi/AnYl6Nk9GOA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=AnYl6Nk9GOA",
    completed: true
  },
  {
    id: 3,
    title: "HIIT Cardio Workout - Fat Burning",
    author: "JEFIT",
    duration: "25:00",
    category: "Cardio",
    thumbnail: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    completed: false
  },
  {
    id: 4,
    title: "Upper Body Strength Training",
    author: "JEFIT",
    duration: "30:00",
    category: "Upper Body",
    thumbnail: "https://img.youtube.com/vi/AMUR9cpkv8U/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=AMUR9cpkv8U",
    completed: false
  },
  {
    id: 5,
    title: "Leg Day Workout - Build Muscle",
    author: "JEFIT",
    duration: "35:00",
    category: "Legs",
    thumbnail: "https://img.youtube.com/vi/RjexvOAsVtI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=RjexvOAsVtI",
    completed: false
  },
  {
    id: 6,
    title: "5 Min Stretching Routine",
    author: "JEFIT",
    duration: "5:30",
    category: "Stretching",
    thumbnail: "https://img.youtube.com/vi/g_tea8ZNk5A/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
    completed: false
  },
  {
    id: 7,
    title: "Push Up Variations for Chest",
    author: "JEFIT",
    duration: "15:00",
    category: "Chest",
    thumbnail: "https://img.youtube.com/vi/IODxDxX7oi4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    completed: false
  },
  {
    id: 8,
    title: "Back Workout - Pull Exercises",
    author: "JEFIT",
    duration: "22:00",
    category: "Back",
    thumbnail: "https://img.youtube.com/vi/eGo4IYlbE5g/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    completed: false
  },
  {
    id: 9,
    title: "Shoulder Boulder Workout",
    author: "JEFIT",
    duration: "18:00",
    category: "Shoulders",
    thumbnail: "https://img.youtube.com/vi/2yjwXTZQDDI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDI",
    completed: false
  },
  {
    id: 10,
    title: "Arm Blaster - Biceps & Triceps",
    author: "JEFIT",
    duration: "20:00",
    category: "Arms",
    thumbnail: "https://img.youtube.com/vi/ykJmrZ5v0Oo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
    completed: false
  },
  {
    id: 11,
    title: "Yoga for Beginners",
    author: "JEFIT",
    duration: "30:00",
    category: "Yoga",
    thumbnail: "https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
    completed: false
  },
  {
    id: 12,
    title: "Core Strength & Stability",
    author: "JEFIT",
    duration: "12:00",
    category: "Core",
    thumbnail: "https://img.youtube.com/vi/DHD1-2P94DI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=DHD1-2P94DI",
    completed: false
  }
];

const CATEGORIES = [
  'All', 'Full Body', 'Core', 'Cardio', 'Upper Body', 'Legs', 
  'Chest', 'Back', 'Shoulders', 'Arms', 'Yoga', 'Stretching'
];

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTutorials = TUTORIALS.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tutorial.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Workout Tutorials 🎬</Title>
          <Subtitle>Learn proper form and discover new exercises</Subtitle>
        </Header>

        <SearchContainer>
          <SearchIcon />
          <SearchInput
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <Categories>
          {CATEGORIES.map(category => (
            <CategoryChip
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </CategoryChip>
          ))}
        </Categories>

        <VideoGrid>
          {filteredTutorials.map(tutorial => (
            <VideoCard
              key={tutorial.id}
              href={tutorial.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ThumbnailContainer>
                <Thumbnail src={tutorial.thumbnail} alt={tutorial.title} />
                <Duration>
                  <AccessTime fontSize="small" style={{ fontSize: '14px' }} />
                  {tutorial.duration}
                </Duration>
                {tutorial.completed && (
                  <CompletedBadge>✓</CompletedBadge>
                )}
              </ThumbnailContainer>
              <VideoInfo>
                <VideoTitle>{tutorial.title}</VideoTitle>
                <VideoMeta>
                  <Author>
                    <Person fontSize="small" />
                    {tutorial.author}
                  </Author>
                  <CategoryTag>{tutorial.category}</CategoryTag>
                </VideoMeta>
              </VideoInfo>
            </VideoCard>
          ))}
        </VideoGrid>
      </Wrapper>
    </Container>
  );
};

export default Tutorials;