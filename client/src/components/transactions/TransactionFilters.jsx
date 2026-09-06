import {
    Search,
    SlidersHorizontal,
    Download
} from "lucide-react";

export default function TransactionFilters() {
    return (
        <div className="filters-bar">

            <div className="filter-search">
                <Search size={16} />

                <input
                    type="text"
                    placeholder="Search transaction ID, user or merchant..."
                />
            </div>

            <select className="filter-select">
                <option>All Risk Levels</option>
                <option>Low Risk</option>
                <option>Medium Risk</option>
                <option>High Risk</option>
            </select>

            <select className="filter-select">
                <option>All Statuses</option>
                <option>Approved</option>
                <option>Review</option>
                <option>Blocked</option>
            </select>

            <button className="filter-button">
                <SlidersHorizontal size={15} />
                Filters
            </button>

            <button className="filter-button">
                <Download size={15} />
                Export
            </button>

        </div>
    );
}