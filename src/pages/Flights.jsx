import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { flightService } from "../services/flightService";
import LoadingSpinner from "../components/LoadingSpinner";
import {
    Plane,
    MapPin,
    Calendar,
    Users,
    ArrowRight,
    Search,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    Info,
    CreditCard,
    User
} from "lucide-react";
import { useNotification } from "../components/notificationContext";
import { useNavigate } from "react-router-dom";

const Flights = () => {
    const { balance, refreshWallet } = useWallet();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("search"); // search, results, details, confirmation
    const [airports, setAirports] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [itineraryDetails, setItineraryDetails] = useState(null);

    const [searchParams, setSearchParams] = useState({
        type: "Oneway",
        class: "Y",
        adult: 1,
        children: 0,
        infant: 0,
        currency: "NGN",
        itineraries: [
            {
                Departure: "",
                Destination: "",
                DepartureDate: ""
            }
        ]
    });

    const [passengerData, setPassengerData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: "Male",
        title: "Mr",
        dob: "",
        address: "",
        country: "Nigeria",
        city: ""
    });

    useEffect(() => {
        fetchAirports();
    }, []);

    const fetchAirports = async () => {
        try {
            const data = await flightService.getAirports();
            console.log("Airports data received:", data);
            setAirports(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch airports error:", error);
            showNotification("error", "Error", "Failed to load airports");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchParams.itineraries[0].Departure || !searchParams.itineraries[0].Destination) {
            showNotification("error", "Error", "Please select departure and destination");
            return;
        }

        setLoading(true);
        try {
            const results = await flightService.searchFlights(searchParams);
            setSearchResults(results);
            setStep("results");
        } catch (error) {
            showNotification("error", "Search Failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFlight = async (flight) => {
        setLoading(true);
        try {
            const res = await flightService.selectFlight({
                id: flight.order_id || flight.trip_id, // Adjust based on actual provider response
                currency: "NGN"
            });
            setSelectedFlight(flight);
            setItineraryDetails(res);
            setStep("details");
        } catch (error) {
            showNotification("error", "Selection Failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (balance < (selectedFlight?.fare || selectedFlight?.amount || 0)) {
            showNotification("error", "Insufficient Balance", "Please fund your wallet");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...passengerData,
                id: itineraryDetails.order_id || itineraryDetails.trip_id,
                total_amount: selectedFlight?.fare || selectedFlight?.amount || 0,
                currency: "NGN"
            };
            const res = await flightService.bookFlight(payload);
            await refreshWallet();
            setStep("confirmation");
            showNotification("success", "Success", "Flight booked tentatively");
        } catch (error) {
            showNotification("error", "Booking Failed", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F8FB] to-[#EDE9F7] py-8 px-4 relative">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-white/30 pointer-events-auto">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center text-center max-w-sm mx-4 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                        <Plane size={40} className="text-[#5C2D91]" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Coming Soon</h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        We're working hard to bring you the best flight booking experience. Stay tuned!
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 bg-[#5C2D91] text-white rounded-xl font-bold hover:bg-[#4A2475] transition-colors shadow-lg shadow-purple-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto opacity-50 grayscale-[0.5] pointer-events-none">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {step !== "search" && (
                                <button onClick={() => setStep(step === "results" ? "search" : step === "details" ? "results" : "search")} className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2">
                                    <ArrowLeft size={24} />
                                </button>
                            )}
                            Flight Booking
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Find and book available flight trips
                        </p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <div className="text-xs text-gray-400 uppercase font-semibold">Wallet Balance</div>
                        <div className="text-lg font-bold text-[#5C2D91]">{formatCurrency(balance)}</div>
                    </div>
                </div>

                {loading && <LoadingSpinner />}

                {/* Step: Search */}
                {step === "search" && (
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-[#5C2D91]" /> From
                                </label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50 h-12"
                                    value={searchParams.itineraries[0].Departure}
                                    onChange={(e) => {
                                        const newItin = [...searchParams.itineraries];
                                        newItin[0].Departure = e.target.value;
                                        setSearchParams({ ...searchParams, itineraries: newItin });
                                    }}
                                    required
                                >
                                    <option value="">Select Departure Airport</option>
                                    {Array.isArray(airports) && airports.map(a => (
                                        <option key={a.AirportCode} value={a.AirportCode}>{a.AirportName} ({a.AirportCode})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-[#5C2D91]" /> To
                                </label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50 h-12"
                                    value={searchParams.itineraries[0].Destination}
                                    onChange={(e) => {
                                        const newItin = [...searchParams.itineraries];
                                        newItin[0].Destination = e.target.value;
                                        setSearchParams({ ...searchParams, itineraries: newItin });
                                    }}
                                    required
                                >
                                    <option value="">Select Destination Airport</option>
                                    {Array.isArray(airports) && airports.map(a => (
                                        <option key={a.AirportCode} value={a.AirportCode}>{a.AirportName} ({a.AirportCode})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-[#5C2D91]" /> Departure Date
                                </label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50 h-12"
                                    value={searchParams.itineraries[0].DepartureDate}
                                    onChange={(e) => {
                                        const newItin = [...searchParams.itineraries];
                                        newItin[0].DepartureDate = e.target.value;
                                        setSearchParams({ ...searchParams, itineraries: newItin });
                                    }}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Users size={16} className="text-[#5C2D91]" /> Passengers (Adults)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="9"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50 h-12"
                                    value={searchParams.adult}
                                    onChange={(e) => setSearchParams({ ...searchParams, adult: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#5C2D91] to-[#2E1647] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Search size={20} />
                            Search Available Flights
                        </button>
                    </form>
                )}

                {/* Step: Results */}
                {step === "results" && searchResults && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Available Flights</h3>
                        {(() => {
                            let allFlights = [];
                            if (Array.isArray(searchResults)) {
                                allFlights = searchResults;
                            } else if (typeof searchResults === 'object') {
                                Object.keys(searchResults).forEach(providerKey => {
                                    const providerData = searchResults[providerKey];
                                    if (providerData && Array.isArray(providerData.data)) {
                                        allFlights = [...allFlights, ...providerData.data.map(f => ({ ...f, providerKey }))];
                                    }
                                });
                            }

                            if (allFlights.length === 0) {
                                return (
                                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                                        <Info size={40} className="text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No flights found for this route.</p>
                                        <button onClick={() => setStep('search')} className="mt-4 text-[#5C2D91] font-bold hover:underline">
                                            Try Another Search
                                        </button>
                                    </div>
                                );
                            }

                            return allFlights.map((flight, idx) => (
                                <div key={`${flight.providerKey || 'f'}-${idx}`} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-50">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-50 rounded-xl">
                                                <Plane className="text-[#5C2D91]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{flight.provider?.name || flight.providerKey || "Flight"}</h4>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">{flight.trip_no || flight.order_id}</p>
                                            </div>
                                        </div>
                                        <div className="text-center flex-1 hidden md:block">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="text-sm font-bold">{flight.departure_terminal || searchParams.itineraries[0].Departure}</div>
                                                <ArrowRight size={16} className="text-gray-300" />
                                                <div className="text-sm font-bold">{flight.destination_terminal || searchParams.itineraries[0].Destination}</div>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{flight.departure_time || flight.trip_date || "Time TBD"}</div>
                                        </div>
                                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <div className="text-lg font-black text-[#5C2D91]">{formatCurrency(flight.fare || flight.amount || 0)}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">Per Adult</div>
                                            </div>
                                            <button
                                                onClick={() => handleSelectFlight(flight)}
                                                className="px-6 py-2 bg-[#5C2D91] text-white rounded-lg font-semibold hover:bg-[#4A2475] transition-colors"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                )}

                {/* Step: Details / Booking Form */}
                {step === "details" && itineraryDetails && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-l-[#5C2D91]">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Info size={18} className="text-[#5C2D91]" /> Flight Summary
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-400 mb-1">Route</div>
                                    <div className="font-semibold">{itineraryDetails?.narration || "Flight Trip"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1">Date</div>
                                    <div className="font-semibold">{itineraryDetails?.order_ticket_date || selectedFlight?.trip_date}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1">Fare</div>
                                    <div className="font-bold text-[#5C2D91]">{formatCurrency(itineraryDetails?.order_amount || selectedFlight?.fare || selectedFlight?.amount || 0)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1">Provider</div>
                                    <div className="font-semibold">{itineraryDetails?.provider || selectedFlight?.provider?.name || selectedFlight?.providerKey}</div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBooking} className="bg-white rounded-2xl shadow-sm p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <User size={20} className="text-[#5C2D91]" /> Passenger Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50"
                                        value={passengerData.title}
                                        onChange={(e) => setPassengerData({ ...passengerData, title: e.target.value })}
                                    >
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50"
                                        value={passengerData.firstname}
                                        onChange={(e) => setPassengerData({ ...passengerData, firstname: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50"
                                        value={passengerData.lastname}
                                        onChange={(e) => setPassengerData({ ...passengerData, lastname: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50"
                                        value={passengerData.email}
                                        onChange={(e) => setPassengerData({ ...passengerData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50"
                                        value={passengerData.phone}
                                        onChange={(e) => setPassengerData({ ...passengerData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5C2D91] outline-none bg-gray-50"
                                        value={passengerData.dob}
                                        onChange={(e) => setPassengerData({ ...passengerData, dob: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-xl mb-8 flex gap-3 border border-orange-100">
                                <CreditCard className="text-orange-500 shrink-0" size={20} />
                                <p className="text-xs text-orange-800 leading-relaxed">
                                    By clicking "Complete Booking", the total amount will be deducted from your Zippypay wallet. This is a tentative booking. Tickets are issued after final confirmation.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5C2D91] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                Complete Booking ({formatCurrency(itineraryDetails?.order_amount || selectedFlight?.fare || selectedFlight?.amount || 0)})
                            </button>
                        </form>
                    </div>
                )}

                {/* Step: Confirmation */}
                {step === "confirmation" && (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3">Booking Tentative!</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Your flight booking has been successfully initiated. You can find the details in your transactions. Our team will verify and issue your final ticket shortly.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/transactions')}
                                className="w-full py-4 bg-[#5C2D91] text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
                            >
                                View Transaction
                            </button>
                            <button
                                onClick={() => setStep("search")}
                                className="w-full py-4 text-[#5C2D91] font-bold hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Book Another Flight
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flights;
