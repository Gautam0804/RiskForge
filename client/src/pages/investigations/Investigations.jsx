import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";



import {

    Search,

    ShieldAlert,

    Clock,

    CheckCircle,

    AlertTriangle

} from "lucide-react";



import PageHeader

    from "../../components/common/PageHeader";



import InvestigationPanel

    from "../../components/investigations/InvestigationPanel";



import "./Investigations.css";





export default function Investigations() {



    const [

        investigations,

        setInvestigations

    ] = useState([]);





    const [

        loading,

        setLoading

    ] = useState(true);





    const [

        error,

        setError

    ] = useState("");





    const [

        search,

        setSearch

    ] = useState("");





    const [

        statusFilter,

        setStatusFilter

    ] = useState("all");





    /*

     * Load investigations

     */

    async function loadInvestigations() {



        setLoading(true);

        setError("");





        try {
            const response = await api.get("/investigations");
            const data = response.data;





            const items =

                data.data?.investigations ||

                data.investigations ||

                [];





            setInvestigations(items);



        } catch (err) {



            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load investigations."
            );



        } finally {



            setLoading(false);

        }

    }





    useEffect(() => {



        loadInvestigations();



    }, []);





    /*

     * Filter investigations

     */

    const filteredInvestigations =

        useMemo(() => {



            const query =

                search

                    .trim()

                    .toLowerCase();





            return investigations.filter(

                (item) => {



                    /*

                     * Status filter

                     */

                    if (

                        statusFilter !==

                        "all" &&

                        item.status !==

                        statusFilter

                    ) {



                        return false;

                    }





                    /*

                     * Search filter

                     */

                    if (!query) {

                        return true;

                    }





                    const searchableText = [

                        item.merchant,

                        item.investigation_id,

                        item.transaction_id,

                        item.location_city,

                        item.transaction_type,

                        item.risk_level,

                        item.status,

                        item.decision

                    ]

                        .filter(Boolean)

                        .join(" ")

                        .toLowerCase();





                    return searchableText.includes(

                        query

                    );

                }

            );



        }, [

            investigations,

            search,

            statusFilter

        ]);





    /*

     * Statistics

     */

    const statistics =

        useMemo(() => {



            const total =

                investigations.length;





            const active =

                investigations.filter(

                    (item) =>

                        item.status ===

                            "open" ||

                        item.status ===

                            "investigating"

                ).length;





            const highRisk =

                investigations.filter(

                    (item) =>

                        item.risk_level ===

                            "high" ||

                        item.risk_level ===

                            "critical"

                ).length;





            const resolved =

                investigations.filter(

                    (item) =>

                        item.status ===

                            "resolved" ||

                        item.status ===

                            "closed"

                ).length;





            return {

                total,

                active,

                highRisk,

                resolved

            };



        }, [investigations]);





    /*

     * Clear filters

     */

    function clearFilters() {



        setSearch("");

        setStatusFilter("all");

    }





    return (

        <div className="investigations-page">



            <PageHeader

                title="Investigations"

                description="Review suspicious transactions and manage fraud investigations."

            />





            {/* =================================================

                STATISTICS

            ================================================= */}



            <section className="investigation-overview">



                <div className="overview-card">



                    <div className="overview-icon overview-blue">



                        <ShieldAlert

                            size={19}

                        />



                    </div>



                    <div className="overview-content">



                        <span>

                            TOTAL INVESTIGATIONS

                        </span>



                        <strong>

                            {loading

                                ? "—"

                                : statistics.total}

                        </strong>



                    </div>



                </div>





                <div className="overview-card">



                    <div className="overview-icon overview-yellow">



                        <Clock

                            size={19}

                        />



                    </div>



                    <div className="overview-content">



                        <span>

                            ACTIVE

                        </span>



                        <strong>

                            {loading

                                ? "—"

                                : statistics.active}

                        </strong>



                    </div>



                </div>





                <div className="overview-card">



                    <div className="overview-icon overview-red">



                        <AlertTriangle

                            size={19}

                        />



                    </div>



                    <div className="overview-content">



                        <span>

                            HIGH RISK

                        </span>



                        <strong>

                            {loading

                                ? "—"

                                : statistics.highRisk}

                        </strong>



                    </div>



                </div>





                <div className="overview-card">



                    <div className="overview-icon overview-green">



                        <CheckCircle

                            size={19}

                        />



                    </div>



                    <div className="overview-content">



                        <span>

                            RESOLVED

                        </span>



                        <strong>

                            {loading

                                ? "—"

                                : statistics.resolved}

                        </strong>



                    </div>



                </div>



            </section>





            {/* =================================================

                FILTER BAR

            ================================================= */}



            <section className="investigation-toolbar">



                <div className="investigation-search">



                    <Search

                        size={17}

                    />



                    <input

                        type="text"

                        value={search}

                        onChange={(event) =>

                            setSearch(

                                event.target.value

                            )

                        }

                        placeholder="Search merchant, transaction ID, location..."

                    />



                </div>





                <div className="investigation-filter">



                    <select

                        value={statusFilter}

                        onChange={(event) =>

                            setStatusFilter(

                                event.target.value

                            )

                        }

                    >



                        <option value="all">

                            All Status

                        </option>



                        <option value="open">

                            Open

                        </option>



                        <option value="investigating">

                            Investigating

                        </option>



                        <option value="resolved">

                            Resolved

                        </option>



                        <option value="closed">

                            Closed

                        </option>



                    </select>



                </div>





                {(search ||

                    statusFilter !== "all") && (



                    <button

                        type="button"

                        className="clear-investigation-filter"

                        onClick={

                            clearFilters

                        }

                    >

                        Clear

                    </button>



                )}



            </section>





            {/* =================================================

                QUEUE HEADER

            ================================================= */}



            <div className="investigation-results-heading">



                <div>



                    <h2>

                        Investigation Queue

                    </h2>



                    <p>

                        Suspicious transactions requiring analysis

                    </p>



                </div>





                <div className="investigation-count">



                    Showing{" "}

                    {filteredInvestigations.length}

                    {" "}of{" "}

                    {investigations.length}



                </div>



            </div>





            {/* =================================================

                ERROR

            ================================================= */}



            {error && (



                <div className="page-investigation-error">



                    <AlertTriangle

                        size={17}

                    />



                    {error}



                </div>



            )}





            {/* =================================================

                PANEL

            ================================================= */}



            <InvestigationPanel

                investigations={

                    filteredInvestigations

                }

                setInvestigations={

                    setInvestigations

                }

                loading={loading}

                error={error}

                setError={setError}

            />



        </div>

    );

}