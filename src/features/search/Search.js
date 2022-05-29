import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./search.module.scss";
import {
    fetchResultsAsync,
    updateFilter,
} from "./searchSlice";
import moment from "moment";
import { useEffect } from "react";

export function SearchForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const handleData = (data) => {
        console.log(data);
        dispatch(fetchResultsAsync(data));
    };
    return (
        <section className={styles.searchbox}>
            <h1>Book My Flight</h1>
            <form onSubmit={handleSubmit(handleData)}>
                <fieldset>
                    <label className={styles.field}>
                        <span className={styles.text}>From</span>
                        <input
                            {...register("from", { required: true })}
                            type="text"
                            name="from"
                            id="from"
                        />
                        {errors.from && <p>This field is required</p>}
                    </label>
                    <label className={styles.field}>
                        <span className={styles.text}>To</span>
                        <input
                            {...register("to", { required: true })}
                            type="text"
                            name="to"
                            id="to"
                        />
                        {errors.to && <p>This field is required</p>}
                    </label>
                    <label className={styles.field}>
                        <span className={styles.text}>Departure</span>
                        <input
                            {...register("departure", { required: true })}
                            type="date"
                            name="departure"
                            id="departure"
                        />
                        {errors.departure && <p>This field is required</p>}
                    </label>
                    <label className={styles.field}>
                        <span className={styles.text}>Return</span>
                        <input
                            {...register("return", { required: false })}
                            type="date"
                            name="return"
                            id="return"
                        />
                    </label>
                </fieldset>
                <button className={styles.searchbutton} type="submit">
                    Search
                </button>
            </form>
        </section>
    );
}

export function SearchResults() {
    const dispatch = useDispatch();
    const { filtered: results, selected: selectedAirlines } = useSelector(
        (state) => state.search.filter
    );
    const pagination = useSelector((state) => state.search.pagination);
    if (results.length === 0) {
        return null;
    }

    const { page, next, prev } = pagination;
    const handleNext = () => {
        dispatch(fetchResultsAsync({ selectedAirlines, page: page + 1 }));
    };

    const handlePrevious = () => {
        dispatch(fetchResultsAsync({ selectedAirlines, page: page - 1 }));
    };

    return (
        <section className={styles.resultpane}>
            <aside className={styles.sidebar}>
                <Filter />
            </aside>
            <main className={styles.results}>
                {results.map((result) => {
                    // console.log(result);
                    const { company, segment, price = "100" } = result;
                    const {
                        departureTime,
                        arrivalTime,
                        origin,
                        destination,
                    } = segment[0];
                    return (
                        <div className={styles.result} key={result.id}>
                            <div className={styles.item}>
                                <div className={styles.company}>{company}</div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.departureTime}>
                                    {moment(departureTime).format("HH:mm")}
                                </div>
                                <div className={styles.origin}>{origin}</div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.arrivalTime}>
                                    {moment(arrivalTime).format("HH:mm")}
                                </div>
                                <div className={styles.destination}>
                                    {destination}
                                </div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.price}>${price}</div>
                            </div>
                            <div className={styles.item}>
                                <button>Book now</button>
                            </div>
                        </div>
                    );
                })}

                <section>
                    <button
                        className={styles.loadmore}
                        onClick={handlePrevious}
                        disabled={!prev}
                    >
                        Previous
                    </button>
                    <button
                        className={styles.loadmore}
                        onClick={handleNext}
                        disabled={!next}
                    >
                        Next
                    </button>
                </section>
            </main>
        </section>
    );
}

export function Filter() {
    const dispatch = useDispatch();
    const filter = useSelector((state) => state.search.filter);
    const { uniqueAirlines, selected } = filter;
    const airlines = Object.keys(uniqueAirlines);

    const handleData = (e) => {
        const { value, checked } = e.target;
        dispatch(
            updateFilter({
                value,
                checked,
            })
        );
    };
    useEffect(() => {
        dispatch(fetchResultsAsync({ selectedAirlines: selected }));
    }, [selected,dispatch]);
    return (
        <div className={styles.filter}>
            <h3>Airlines</h3>
            <form>
                {airlines.map((airline) => {
                    return (
                        <label key={airline} className={styles.airline}>
                            <input
                                type="checkbox"
                                name={airline}
                                value={airline}
                                onChange={handleData}
                            />
                            {airline} ({uniqueAirlines[airline]})
                        </label>
                    );
                })}
            </form>
        </div>
    );
}
