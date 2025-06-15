import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const cardData = Array.from({ length: 5 }, (_, i) => `Card ${i + 1}`);

const HorizontalCardSlider = () => {
    // const theme = useTheme();    
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const cardWidth = container.offsetWidth;
        const index = Math.round(scrollLeft / cardWidth);
        setCurrentIndex(index);
    };

    const scrollToCard = (index: number) => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                left: container.offsetWidth * index,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Box>
            {/* Scrollable Card Container */}
            <Box
                ref={containerRef}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
                    width: '100%',
                    '& > *': {
                        scrollSnapAlign: 'start',
                        flex: '0 0 100%',
                    },
                }}
            >
                {cardData.map((text, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            p: 2,
                            boxShadow: 3,
                            borderRadius: 2,
                            m: 1,
                            bgcolor: 'background.paper',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 200,
                            fontSize: '1.5rem',
                            flexShrink: 0,
                            minWidth: '100%',
                        }}
                    >
                        {text}
                    </Box>
                ))}
            </Box>

            {/* Pagination Dots */}
            <Box display="flex" justifyContent="center" mt={2}>
                {cardData.map((_, idx) => (
                    <IconButton
                        key={idx}
                        size="small"
                        onClick={() => scrollToCard(idx)}
                    >
                        {currentIndex === idx ? (
                            <CircleIcon fontSize="small" />
                        ) : (
                            <RadioButtonUncheckedIcon fontSize="small" />
                        )}
                    </IconButton>
                ))}
            </Box>
        </Box>
    );
};

export default HorizontalCardSlider;
