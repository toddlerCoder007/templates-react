import { ChevronLeft, ChevronRight } from '@mui/icons-material'; // Icons for chevron
import { Box, Collapse, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import React, { useState } from 'react';

interface SidebarItem {
    label: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    const [expanded, setExpanded] = useState(false); // State for expanding the sidebar
    const [hovered, setHovered] = useState(false);  // State for hover effect
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    // Function to toggle sidebar expansion permanently
    const toggleSidebar = () => setExpanded(prev => !prev);

    // Handle item click
    const handleItemClick = (index: number) => {
        setSelectedItem(prev => (prev === index ? null : index));
    };

    return (
        <Box
            sx={{
                width: expanded || hovered ? 250 : 70, // Expand if permanently expanded or hovered
                backgroundColor: '#2c3e50',
                color: 'white',
                transition: 'width 0.3s',
            }}
            onMouseEnter={() => !expanded && setHovered(true)}  // Only expand on hover if not permanently expanded
            onMouseLeave={() => !expanded && setHovered(false)} // Collapse on hover out if not permanently expanded
        >
            {/* Chevron button at the top to expand/collapse */}
            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={toggleSidebar}>
                    {expanded ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </Box>

            <List>
                {items.map((item, index) => (
                    <ListItemButton
                        key={index}
                        onClick={() => handleItemClick(index)}
                        sx={{
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: expanded || hovered ? 'flex-start' : 'center', // Center the icon when collapsed
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton sx={{ color: 'white' }}>{item.icon}</IconButton>
                            <Collapse in={expanded || hovered} timeout="auto" unmountOnExit>
                                <ListItemText primary={item.label} sx={{ marginLeft: 2 }} />
                            </Collapse>
                        </Box>
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
