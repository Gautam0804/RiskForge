import {
    Search,
    SlidersHorizontal,
    Download,
    X
} from "lucide-react";

export default function TransactionFilters({
    search,
    setSearch,
    risk,
    setRisk,
    status,
    setStatus,
    onReset,
    onExport
}) {
    return (
        <div className="filters-bar">
            <div className="filter-search">
                <Search size={16} />

                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transaction ID or merchant..."
                />
            </div>

            <select
                className="filter-select"
                value={risk}
                onChange={(event) => setRisk(event.target.value)}
            >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
            </select>

            <select
                className="filter-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
            >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="review">Review</option>
                <option value="blocked">Blocked</option>
            </select>

            <button
                type="button"
                className="filter-button"
                onClick={onReset}
            >
                <X size={15} />
                Reset
            </button>

            <button
                type="button"
                className="filter-button"
                onClick={onExport}
            >
                <Download size={15} />
                Export
            </button>
        </div>
    );
}
