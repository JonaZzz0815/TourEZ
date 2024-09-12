import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HotelButton from './HotelButton';
import HotelModal from './HotelModal';
import categoriesData from './categories.json';

import { Slider, Checkbox, FormControlLabel, TextField, MenuItem, Chip } from '@mui/material';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;
const categories = categoriesData
    .map((category) => category.catergories)
    .filter((category) => category !== null);


const HotelSearch = ({ selectedCity, onHotelSelect, addItemToProcedure }) => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchOptions, setSearchOptions] = useState({
        businessCategories: [],
        distanceRange: 2,
        ratingCriteria: 0,
        sortByRating: false,
        sortByNum: false,
    });
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchHotelsByCity = async () => {
            try {
                if (selectedCity) {
                    const response = await axios.get('http://localhost:8050/getHotelsByCity', {
                        params: {
                            city: selectedCity,
                            state: sessionStorage.getItem("selectedState")
                        },
                    });
                    setHotels(response.data);
                } else {
                    setHotels([]);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };

        fetchHotelsByCity();
    }, [selectedCity]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleHotelClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowModal(true);
        onHotelSelect(hotel);
    };

    const handleCloseModal = () => {
        setSelectedHotel(null);
        setShowModal(false);
    };

    const handleAddToProcedure = () => {
        addItemToProcedure(selectedHotel);
        console.log("add in HotelSearch:", selectedHotel);
        handleCloseModal();
    };

    const handleDistanceRangeChange = (event, newValue) => {
        setSearchOptions((prevOptions) => ({
            ...prevOptions,
            distanceRange: newValue,
        }));
    };

    const handleRatingCriteriaChange = (event, newValue) => {
        setSearchOptions((prevOptions) => ({
            ...prevOptions,
            ratingCriteria: newValue,
        }));
    };

    const handleSortByRatingChange = (event) => {
        setSearchOptions((prevOptions) => ({
            ...prevOptions,
            sortByRating: event.target.checked,
        }));
    };

    const handleSortByNumChange = (event) => {
        setSearchOptions((prevOptions) => ({
            ...prevOptions,
            sortByNum: event.target.checked,
        }));
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);

        // Filter the categories based on the user's input
        const filtered = categories.filter(
            (category) =>
                category && category.toLowerCase().includes(inputValue.toLowerCase()) &&
                !searchOptions.businessCategories.includes(category)
        );
        setFilteredCategories(filtered);
    };

    const handleInputClick = () => {
        setIsDropdownOpen(true);
        // Filter the categories to exclude already selected categories
        const filtered = categories.filter(
            (category) => !searchOptions.businessCategories.includes(category)
        );
        setFilteredCategories(filtered);
    };

    const handleCategorySelect = (category) => {
        setSearchOptions((prevOptions) => ({
            ...prevOptions,
            businessCategories: [...prevOptions.businessCategories, category],
        }));
        setInputValue('');
        setIsDropdownOpen(false);
    };

    const handleCategoryRemove = (category) => {
        setSearchOptions((prevOptions) => ({
            ...prevOptions,
            businessCategories: prevOptions.businessCategories.filter((cat) => cat !== category),
        }));
    };


    const handleSearchClick = async () => {
        try {
            console.log('searchOptions:', searchOptions);
            const response = await axios.get('http://localhost:8050/getHotelsByNearbyBusinessQuality', {
                params: {
                    city: selectedCity,
                    state: sessionStorage.getItem("selectedState"),
                    ...searchOptions,
                },
            });
            setHotels(response.data);
        } catch (error) {
            console.error('Error searching hotels:', error);
        }
    };

    return (
        <div>
            <h2>Hotels in {selectedCity}</h2>
            <div>
                <label>Surrounding businesses preference:</label>
                <div ref={inputRef}>
                    <TextField
                        value={inputValue}
                        onChange={handleInputChange}
                        onClick={handleInputClick}
                        fullWidth
                    />
                    {isDropdownOpen && (
                        <div>
                            {filteredCategories.map((category) => (
                                <MenuItem
                                    key={category}
                                    value={category}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </MenuItem>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    {searchOptions.businessCategories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            onDelete={() => handleCategoryRemove(category)}
                        />
                    ))}
                </div>
                <label>Distance Range:</label>
                <Slider
                    value={searchOptions.distanceRange}
                    min={1}
                    max={10}
                    step={1}
                    onChange={handleDistanceRangeChange}
                    valueLabelDisplay="auto"
                />
                <label>Rating Criteria:</label>
                <Slider
                    value={searchOptions.ratingCriteria}
                    min={0}
                    max={5}
                    step={0.5}
                    onChange={handleRatingCriteriaChange}
                    valueLabelDisplay="auto"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={searchOptions.sortByRating}
                            onChange={handleSortByRatingChange}
                        />
                    }
                    label="Sort by Rating"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={searchOptions.sortByNum}
                            onChange={handleSortByNumChange}
                        />
                    }
                    label="Sort by Number of Businesses"
                />
                <StyledButton onClick={handleSearchClick}>Search</StyledButton>
            </div>
            {hotels.length > 0 ? (
                hotels.map((hotel) => (
                    <HotelButton
                        key={hotel.OBJECTID}
                        hotel={hotel}
                        onHotelClick={handleHotelClick}
                    />
                ))
            ) : (
                <p>No hotels found for the selected city.</p>
            )}

            {showModal && selectedHotel && (
                <HotelModal
                    hotel={selectedHotel}
                    onClose={handleCloseModal}
                    onAddToProcedure={handleAddToProcedure}
                />
            )}
        </div>
    );
};

export default HotelSearch;
