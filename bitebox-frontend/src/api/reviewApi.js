import API from "./axios";


// CREATE REVIEW

export const createReview = async (
    data
) => {

    const response = await API.post(
        "/reviews/",
        data
    );

    return response.data;
};


// GET RESTAURANT REVIEWS

export const getRestaurantReviews =
    async (restaurantId) => {

        const response = await API.get(
            `/reviews/restaurant/${restaurantId}`
        );

        return response.data;
    };


// GET DRIVER REVIEWS

export const getDriverReviews =
    async (driverId) => {

        const response = await API.get(
            `/reviews/driver/${driverId}`
        );

        return response.data;
    };


// GET MENU ITEM REVIEWS

export const getMenuItemReviews =
    async (menuItemId) => {

        const response = await API.get(
            `/reviews/menu-item/${menuItemId}`
        );

        return response.data;
    };