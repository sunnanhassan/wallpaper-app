import { View, Text, Pressable, StyleSheet, TextInput, FlatList } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import Categories from '../../components/categories';
import Wallpapers from '../../components/Wallpaper';
import { useRouter } from 'expo-router';
import { data } from '../../constants/data'; // Import the data

const HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const searchInputRef = useRef(null);
    
    // Initialize the active category with the first category in the array
    const [activeCategories, SetActiveCategories] = useState(data.categories[0]);
    
    const router = useRouter();

    // Ensure that a category is always selected and cannot be deselected
    const handleChangeCategories = (cat) => {
        if (cat !== activeCategories) {
            SetActiveCategories(cat); // Update only if a different category is selected
        }
        setSearch(''); // Clear search when a category is selected
    };

    useEffect(() => {
        // This ensures that 'Wallpaper' is the default selected category if it's in the list
        SetActiveCategories(data.categories[0]);
    }, []);

    // Filter categories based on search input
    const filteredCategories = data.categories.filter(category =>
        category.toLowerCase().includes(search.toLowerCase())
    );

    // Render suggestion item
    const renderSuggestionItem = ({ item }) => (
        <Pressable 
            style={styles.suggestionItem} 
            onPress={() => handleChangeCategories(item)}
        >
            <Text>{item}</Text>
        </Pressable>
    );

    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.header}>
                <Pressable>
                    <Text style={styles.title}>
                        Pixel
                    </Text>
                </Pressable>
                <Pressable>
                    <FontAwesome6 name='bars-staggered' size={22} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name='search' size={24} color={theme.colors.neutral(0.4)} />
                    </View>
                    <TextInput
                        placeholder='Search for Categories'
                        style={styles.searchInput}
                        ref={searchInputRef}
                        value={search}
                        onChangeText={value => setSearch(value)}
                    />
                    {search && (
                        <Pressable style={styles.closeIcon} onPress={() => setSearch('')}>
                            <Ionicons name='close' size={24} color={theme.colors.neutral(0.6)} />
                        </Pressable>
                    )}
                </View>
                {search && (
                    <FlatList
                        data={filteredCategories}
                        renderItem={renderSuggestionItem}
                        keyExtractor={item => item}
                        style={styles.suggestionList}
                    />
                )}
            </View>

            {/* Categories and Wallpapers */}
            <View style={styles.categories}>
                <Categories 
                    activeCategories={activeCategories} 
                    handleChangeCategories={handleChangeCategories}
                    categories={data.categories}
                />
            </View>

            {/* Wallpapers */}
            <View style={styles.wallpapersContainer}>
                <Wallpapers selectedTag={activeCategories} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semiBold,
        color: theme.colors.neutral(0.9),
    },
    searchBarContainer: {
        marginHorizontal: wp(4),
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg,
    },
    searchIcon: {
        padding: 8,
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8),
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 8,
        borderRadius: theme.radius.sm,
    },
    suggestionList: {
        maxHeight: hp(20),
        marginTop: 5,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.white,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral(0.1),
    },
    categories: {
        marginTop: 15,
        paddingHorizontal: wp(4),
    },
    wallpapersContainer: {
        flex: 1,
        paddingHorizontal: wp(4),
        marginTop: 15,
    },
});

export default HomeScreen;
