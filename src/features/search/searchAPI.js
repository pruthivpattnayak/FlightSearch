import DATA from "../../data/flightdata.json";

export async function fetchResult(params) {
    const { page = 0, noOfItems = 10, selectedAirlines = [] } = params;
    console.log(params);

    try {
        // get data for selected airlines
        const filteredData =
            selectedAirlines.length === 0
                ? DATA
                : DATA.filter((item) =>
                      selectedAirlines.includes(item.company)
                  );
        const total = Math.ceil(filteredData.length / noOfItems);
        // get data for selected page from filtered data
        const temp = filteredData.slice(
            page * noOfItems,
            (page + 1) * noOfItems
        );
        // work on entire dataset
        const uniqueAirlines = DATA.reduce((acc, { company }) => {
            acc[company] = (acc[company] || 0) + 1;
            return acc;
        }, {});
        const data = {
            results: temp,
            pagination: {
                total,
                page,
                next: page < total - 1,
                prev: page > 0,
            },
            uniqueAirlines,
        };
        // console.log(data);
        return data;
    } catch (error) {
        throw new Error("something went wrong");
    }
}
