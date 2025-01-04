"use client";

import { apiUrl } from "@/lib/apiUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AccountAddress() {
  const [activeEdit, setactiveEdit] = useState(false);
  const [activeAdd, setactiveAdd] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });
  const [showAllAddress, setshowAllAddress] = useState([]);
  useEffect(() => {
    fetchAddresses(); // Fetch addresses when the component mounts
  }, []);
  // Fetch all added addresses
  const fetchAddresses = async () => {
    const token = localStorage.getItem("userToken"); // Replace with your token
    try {
      const { data } = await axios.get(
        `${apiUrl}/customerDashboard/getcustomerAddress`, // Replace with your API endpoint to get addresses
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the header
          },
        }
      );

      if (data.success) {
        console.log("Addresses fetched successfully:", data.addresses); // Assuming 'addresses' is the returned data
        setshowAllAddress(data.addresses); // You can update your state here to store the addresses and render them
        // You can update your state here to store the addresses and render them
      } else {
        console.log("Failed to fetch addresses.");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Add a new address
  const addAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken"); // Replace with your token
    try {
      const { data } = await axios.post(
        `${apiUrl}/customerDashboard/customerAddress`, // Replace with your API endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Address added successfully");
        setactiveEdit(false);
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    const token = localStorage.getItem("userToken"); // Replace with your token logic
    try {
      const { data } = await axios.delete(
        `${apiUrl}/customerDashboard/deletecustomerAddress/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Address deleted successfully");
        // setshowAllAddress((prev) => prev.filter((address) => address.id !== id)); // Remove the deleted address from the state
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="my-account-content account-address">
        <div className="text-center widget-inner-address">
          <button
            className="tf-btn btn-fill animate-hover-btn btn-address mb_20"
            onClick={() => setactiveEdit(true)}
          >
            Add a new address
          </button>
          <form
            className="show-form-address wd-form-address"
            id="formnewAddress"
            onSubmit={(e) => addAddress(e)}
            style={activeEdit ? { display: "block" } : { display: "none" }}
          >
            <div className="title">Add a new address</div>
            <div className="box-field grid-2-lg">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="firstname"
                  name="first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="firstname"
                >
                  First name
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="lastname"
                  name="last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="lastname"
                >
                  Last name
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="company"
                >
                  Company
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="address"
                >
                  Address
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="city"
                >
                  City
                </label>
              </div>
            </div>
            <div className="box-field">
              <label
                htmlFor="country"
                className="mb_10 fw-4 text-start d-block text_black-2 "
              >
                Country/Region
              </label>
              <div className="select-custom">
                <select
                  className="tf-select w-100"
                  id="country"
                  name="address[country]"
                  data-default=""
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                >
                  <option value="---" data-provinces="[]">
                    ---
                  </option>
                  <option
                    value="Australia"
                    data-provinces="[['Australian Capital Territory','Australian Capital Territory'],['New South Wales','New South Wales'],['Northern Territory','Northern Territory'],['Queensland','Queensland'],['South Australia','South Australia'],['Tasmania','Tasmania'],['Victoria','Victoria'],['Western Australia','Western Australia']]"
                  >
                    Australia
                  </option>
                  <option value="Austria" data-provinces="[]">
                    Austria
                  </option>
                  <option value="Belgium" data-provinces="[]">
                    Belgium
                  </option>
                  <option
                    value="Canada"
                    data-provinces="[['Alberta','Alberta'],['British Columbia','British Columbia'],['Manitoba','Manitoba'],['New Brunswick','New Brunswick'],['Newfoundland and Labrador','Newfoundland and Labrador'],['Northwest Territories','Northwest Territories'],['Nova Scotia','Nova Scotia'],['Nunavut','Nunavut'],['Ontario','Ontario'],['Prince Edward Island','Prince Edward Island'],['Quebec','Quebec'],['Saskatchewan','Saskatchewan'],['Yukon','Yukon']]"
                  >
                    Canada
                  </option>
                  <option value="Czech Republic" data-provinces="[]">
                    Czechia
                  </option>
                  <option value="Denmark" data-provinces="[]">
                    Denmark
                  </option>
                  <option value="Finland" data-provinces="[]">
                    Finland
                  </option>
                  <option value="France" data-provinces="[]">
                    France
                  </option>
                  <option value="Germany" data-provinces="[]">
                    Germany
                  </option>
                  <option
                    value="Hong Kong"
                    data-provinces="[['Hong Kong Island','Hong Kong Island'],['Kowloon','Kowloon'],['New Territories','New Territories']]"
                  >
                    Hong Kong SAR
                  </option>
                  <option
                    value="Ireland"
                    data-provinces="[['Carlow','Carlow'],['Cavan','Cavan'],['Clare','Clare'],['Cork','Cork'],['Donegal','Donegal'],['Dublin','Dublin'],['Galway','Galway'],['Kerry','Kerry'],['Kildare','Kildare'],['Kilkenny','Kilkenny'],['Laois','Laois'],['Leitrim','Leitrim'],['Limerick','Limerick'],['Longford','Longford'],['Louth','Louth'],['Mayo','Mayo'],['Meath','Meath'],['Monaghan','Monaghan'],['Offaly','Offaly'],['Roscommon','Roscommon'],['Sligo','Sligo'],['Tipperary','Tipperary'],['Waterford','Waterford'],['Westmeath','Westmeath'],['Wexford','Wexford'],['Wicklow','Wicklow']]"
                  >
                    Ireland
                  </option>

                  <option
                    value="Italy"
                    data-provinces="[['Agrigento','Agrigento'],['Alessandria','Alessandria'],['Ancona','Ancona'],['Aosta','Aosta Valley'],['Arezzo','Arezzo'],['Ascoli Piceno','Ascoli Piceno'],['Asti','Asti'],['Avellino','Avellino'],['Bari','Bari'],['Barletta-Andria-Trani','Barletta-Andria-Trani'],['Belluno','Belluno'],['Benevento','Benevento'],['Bergamo','Bergamo'],['Biella','Biella'],['Bologna','Bologna'],['Bolzano','South Tyrol'],['Brescia','Brescia'],['Brindisi','Brindisi'],['Cagliari','Cagliari'],['Caltanissetta','Caltanissetta'],['Campobasso','Campobasso'],['Carbonia-Iglesias','Carbonia-Iglesias'],['Caserta','Caserta'],['Catania','Catania'],['Catanzaro','Catanzaro'],['Chieti','Chieti'],['Como','Como'],['Cosenza','Cosenza'],['Cremona','Cremona'],['Crotone','Crotone'],['Cuneo','Cuneo'],['Enna','Enna'],['Fermo','Fermo'],['Ferrara','Ferrara'],['Firenze','Florence'],['Foggia','Foggia'],['Forlì-Cesena','Forlì-Cesena'],['Frosinone','Frosinone'],['Genova','Genoa'],['Gorizia','Gorizia'],['Grosseto','Grosseto'],['Imperia','Imperia'],['Isernia','Isernia'],['L'Aquila','L’Aquila'],['La Spezia','La Spezia'],['Latina','Latina'],['Lecce','Lecce'],['Lecco','Lecco'],['Livorno','Livorno'],['Lodi','Lodi'],['Lucca','Lucca'],['Macerata','Macerata'],['Mantova','Mantua'],['Massa-Carrara','Massa and Carrara'],['Matera','Matera'],['Medio Campidano','Medio Campidano'],['Messina','Messina'],['Milano','Milan'],['Modena','Modena'],['Monza e Brianza','Monza and Brianza'],['Napoli','Naples'],['Novara','Novara'],['Nuoro','Nuoro'],['Ogliastra','Ogliastra'],['Olbia-Tempio','Olbia-Tempio'],['Oristano','Oristano'],['Padova','Padua'],['Palermo','Palermo'],['Parma','Parma'],['Pavia','Pavia'],['Perugia','Perugia'],['Pesaro e Urbino','Pesaro and Urbino'],['Pescara','Pescara'],['Piacenza','Piacenza'],['Pisa','Pisa'],['Pistoia','Pistoia'],['Pordenone','Pordenone'],['Potenza','Potenza'],['Prato','Prato'],['Ragusa','Ragusa'],['Ravenna','Ravenna'],['Reggio Calabria','Reggio Calabria'],['Reggio Emilia','Reggio Emilia'],['Rieti','Rieti'],['Rimini','Rimini'],['Roma','Rome'],['Rovigo','Rovigo'],['Salerno','Salerno'],['Sassari','Sassari'],['Savona','Savona'],['Siena','Siena'],['Siracusa','Syracuse'],['Sondrio','Sondrio'],['Taranto','Taranto'],['Teramo','Teramo'],['Terni','Terni'],['Torino','Turin'],['Trapani','Trapani'],['Trento','Trentino'],['Treviso','Treviso'],['Trieste','Trieste'],['Udine','Udine'],['Varese','Varese'],['Venezia','Venice'],['Verbano-Cusio-Ossola','Verbano-Cusio-Ossola'],['Vercelli','Vercelli'],['Verona','Verona'],['Vibo Valentia','Vibo Valentia'],['Vicenza','Vicenza'],['Viterbo','Viterbo']]"
                  >
                    Italy
                  </option>
                  <option
                    value="Japan"
                    data-provinces="[['Aichi','Aichi'],['Akita','Akita'],['Aomori','Aomori'],['Chiba','Chiba'],['Ehime','Ehime'],['Fukui','Fukui'],['Fukuoka','Fukuoka'],['Fukushima','Fukushima'],['Gifu','Gifu'],['Gunma','Gunma'],['Hiroshima','Hiroshima'],['Hokkaidō','Hokkaido'],['Hyōgo','Hyogo'],['Ibaraki','Ibaraki'],['Ishikawa','Ishikawa'],['Iwate','Iwate'],['Kagawa','Kagawa'],['Kagoshima','Kagoshima'],['Kanagawa','Kanagawa'],['Kumamoto','Kumamoto'],['Kyōto','Kyoto'],['Kōchi','Kochi'],['Mie','Mie'],['Miyagi','Miyagi'],['Miyazaki','Miyazaki'],['Nagano','Nagano'],['Nagasaki','Nagasaki'],['Nara','Nara'],['Niigata','Niigata'],['Okayama','Okayama'],['Okinawa','Okinawa'],['Saga','Saga'],['Saitama','Saitama'],['Shiga','Shiga'],['Shimane','Shimane'],['Shizuoka','Shizuoka'],['Tochigi','Tochigi'],['Tokushima','Tokushima'],['Tottori','Tottori'],['Toyama','Toyama'],['Tōkyō','Tokyo'],['Wakayama','Wakayama'],['Yamagata','Yamagata'],['Yamaguchi','Yamaguchi'],['Yamanashi','Yamanashi'],['Ōita','Oita'],['Ōsaka','Osaka']]"
                  >
                    Japan
                  </option>
                  <option
                    value="Malaysia"
                    data-provinces="[['Johor','Johor'],['Kedah','Kedah'],['Kelantan','Kelantan'],['Kuala Lumpur','Kuala Lumpur'],['Labuan','Labuan'],['Melaka','Malacca'],['Negeri Sembilan','Negeri Sembilan'],['Pahang','Pahang'],['Penang','Penang'],['Perak','Perak'],['Perlis','Perlis'],['Putrajaya','Putrajaya'],['Sabah','Sabah'],['Sarawak','Sarawak'],['Selangor','Selangor'],['Terengganu','Terengganu']]"
                  >
                    Malaysia
                  </option>
                  <option value="Netherlands" data-provinces="[]">
                    Netherlands
                  </option>
                  <option
                    value="New Zealand"
                    data-provinces="[['Auckland','Auckland'],['Bay of Plenty','Bay of Plenty'],['Canterbury','Canterbury'],['Chatham Islands','Chatham Islands'],['Gisborne','Gisborne'],['Hawke's Bay','Hawke’s Bay'],['Manawatu-Wanganui','Manawatū-Whanganui'],['Marlborough','Marlborough'],['Nelson','Nelson'],['Northland','Northland'],['Otago','Otago'],['Southland','Southland'],['Taranaki','Taranaki'],['Tasman','Tasman'],['Waikato','Waikato'],['Wellington','Wellington'],['West Coast','West Coast']]"
                  >
                    New Zealand
                  </option>
                  <option value="Norway" data-provinces="[]">
                    Norway
                  </option>
                  <option value="Poland" data-provinces="[]">
                    Poland
                  </option>
                  <option
                    value="Portugal"
                    data-provinces="[['Aveiro','Aveiro'],['Açores','Azores'],['Beja','Beja'],['Braga','Braga'],['Bragança','Bragança'],['Castelo Branco','Castelo Branco'],['Coimbra','Coimbra'],['Faro','Faro'],['Guarda','Guarda'],['Leiria','Leiria'],['Lisboa','Lisbon'],['Madeira','Madeira'],['Portalegre','Portalegre'],['Porto','Porto'],['Santarém','Santarém'],['Setúbal','Setúbal'],['Viana do Castelo','Viana do Castelo'],['Vila Real','Vila Real'],['Viseu','Viseu'],['Évora','Évora']]"
                  >
                    Portugal
                  </option>
                  <option value="Singapore" data-provinces="[]">
                    Singapore
                  </option>
                  <option
                    value="South Korea"
                    data-provinces="[['Busan','Busan'],['Chungbuk','North Chungcheong'],['Chungnam','South Chungcheong'],['Daegu','Daegu'],['Daejeon','Daejeon'],['Gangwon','Gangwon'],['Gwangju','Gwangju City'],['Gyeongbuk','North Gyeongsang'],['Gyeonggi','Gyeonggi'],['Gyeongnam','South Gyeongsang'],['Incheon','Incheon'],['Jeju','Jeju'],['Jeonbuk','North Jeolla'],['Jeonnam','South Jeolla'],['Sejong','Sejong'],['Seoul','Seoul'],['Ulsan','Ulsan']]"
                  >
                    South Korea
                  </option>
                  <option
                    value="Spain"
                    data-provinces="[['A Coruña','A Coruña'],['Albacete','Albacete'],['Alicante','Alicante'],['Almería','Almería'],['Asturias','Asturias Province'],['Badajoz','Badajoz'],['Balears','Balears Province'],['Barcelona','Barcelona'],['Burgos','Burgos'],['Cantabria','Cantabria Province'],['Castellón','Castellón'],['Ceuta','Ceuta'],['Ciudad Real','Ciudad Real'],['Cuenca','Cuenca'],['Cáceres','Cáceres'],['Cádiz','Cádiz'],['Córdoba','Córdoba'],['Girona','Girona'],['Granada','Granada'],['Guadalajara','Guadalajara'],['Guipúzcoa','Gipuzkoa'],['Huelva','Huelva'],['Huesca','Huesca'],['Jaén','Jaén'],['La Rioja','La Rioja Province'],['Las Palmas','Las Palmas'],['León','León'],['Lleida','Lleida'],['Lugo','Lugo'],['Madrid','Madrid Province'],['Melilla','Melilla'],['Murcia','Murcia'],['Málaga','Málaga'],['Navarra','Navarra'],['Ourense','Ourense'],['Palencia','Palencia'],['Pontevedra','Pontevedra'],['Salamanca','Salamanca'],['Santa Cruz de Tenerife','Santa Cruz de Tenerife'],['Segovia','Segovia'],['Sevilla','Seville'],['Soria','Soria'],['Tarragona','Tarragona'],['Teruel','Teruel'],['Toledo','Toledo'],['Valencia','Valencia'],['Valladolid','Valladolid'],['Vizcaya','Biscay'],['Zamora','Zamora'],['Zaragoza','Zaragoza'],['Álava','Álava'],['Ávila','Ávila']]"
                  >
                    Spain
                  </option>
                  <option value="Sweden" data-provinces="[]">
                    Sweden
                  </option>
                  <option value="Switzerland" data-provinces="[]">
                    Switzerland
                  </option>
                  <option
                    value="United Arab Emirates"
                    data-provinces="[['Abu Dhabi','Abu Dhabi'],['Ajman','Ajman'],['Dubai','Dubai'],['Fujairah','Fujairah'],['Ras al-Khaimah','Ras al-Khaimah'],['Sharjah','Sharjah'],['Umm al-Quwain','Umm al-Quwain']]"
                  >
                    United Arab Emirates
                  </option>
                  <option
                    value="United Kingdom"
                    data-provinces="[['British Forces','British Forces'],['England','England'],['Northern Ireland','Northern Ireland'],['Scotland','Scotland'],['Wales','Wales']]"
                  >
                    United Kingdom
                  </option>
                  <option
                    value="United States"
                    data-provinces="[['Alabama','Alabama'],['Alaska','Alaska'],['American Samoa','American Samoa'],['Arizona','Arizona'],['Arkansas','Arkansas'],['Armed Forces Americas','Armed Forces Americas'],['Armed Forces Europe','Armed Forces Europe'],['Armed Forces Pacific','Armed Forces Pacific'],['California','California'],['Colorado','Colorado'],['Connecticut','Connecticut'],['Delaware','Delaware'],['District of Columbia','Washington DC'],['Federated States of Micronesia','Micronesia'],['Florida','Florida'],['Georgia','Georgia'],['Guam','Guam'],['Hawaii','Hawaii'],['Idaho','Idaho'],['Illinois','Illinois'],['Indiana','Indiana'],['Iowa','Iowa'],['Kansas','Kansas'],['Kentucky','Kentucky'],['Louisiana','Louisiana'],['Maine','Maine'],['Marshall Islands','Marshall Islands'],['Maryland','Maryland'],['Massachusetts','Massachusetts'],['Michigan','Michigan'],['Minnesota','Minnesota'],['Mississippi','Mississippi'],['Missouri','Missouri'],['Montana','Montana'],['Nebraska','Nebraska'],['Nevada','Nevada'],['New Hampshire','New Hampshire'],['New Jersey','New Jersey'],['New Mexico','New Mexico'],['New York','New York'],['North Carolina','North Carolina'],['North Dakota','North Dakota'],['Northern Mariana Islands','Northern Mariana Islands'],['Ohio','Ohio'],['Oklahoma','Oklahoma'],['Oregon','Oregon'],['Palau','Palau'],['Pennsylvania','Pennsylvania'],['Puerto Rico','Puerto Rico'],['Rhode Island','Rhode Island'],['South Carolina','South Carolina'],['South Dakota','South Dakota'],['Tennessee','Tennessee'],['Texas','Texas'],['Utah','Utah'],['Vermont','Vermont'],['Virgin Islands','U.S. Virgin Islands'],['Virginia','Virginia'],['Washington','Washington'],['West Virginia','West Virginia'],['Wisconsin','Wisconsin'],['Wyoming','Wyoming']]"
                  >
                    United States
                  </option>
                  <option value="Vietnam" data-provinces="[]">
                    Vietnam
                  </option>
                </select>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="AddressZipNew"
                  name="AddressZipNew"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="AddressZipNew"
                >
                  Postal/ZIP code
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
              </div>
            </div>
            <div className="box-field text-start">
              <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8">
                <input
                  type="checkbox"
                  id="check-new-address"
                  className="tf-check"
                />
                <label
                  htmlFor="check-new-address"
                  className="text_black-2 fw-4"
                >
                  Set as default address.
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-20">
              <button
                type="submit"
                className="tf-btn btn-fill animate-hover-btn"
              >
                Add address
              </button>
              <span
                className="tf-btn btn-fill animate-hover-btn btn-hide-address"
                onClick={() => setactiveEdit(false)}
              >
                Cancel
              </span>
            </div>
          </form>
          <h6 className="mb_20">Your Addresses List</h6>
          {/* Map through addresses and display each one dynamically */}
          {showAllAddress.length > 0 ? (
            showAllAddress.map((address) => (
              <div
                key={address.id}
                className="address-item bg-light p-4 rounded-lg shadow-md mb-4"
              >
                <div className="address-header mb-3">
                  <h5 className="font-bold">
                    {address.firstName} {address.lastName}
                  </h5>
                  <span className="text-muted">{address.company}</span>
                </div>

                <div className="address-body">
                  <p>
                    <strong>Address:</strong> {address.address}
                  </p>
                  <p>
                    <strong>City:</strong> {address.city}
                  </p>
                  <p>
                    <strong>Country:</strong> {address.country}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {address.postalCode}
                  </p>
                  <p>
                    <strong>Phone:</strong> {address.phone}
                  </p>
                </div>

                <div className="address-footer d-flex gap-3 justify-content-start mt-4">
                  {/* <button
                    className="tf-btn btn-fill animate-hover-btn"
                    onClick={() => setactiveAdd(true)} // Show edit form
                  >
                    <span>Edit</span>
                  </button> */}
                  <button
                    className="tf-btn btn-outline animate-hover-btn"
                    onClick={() => handleDeleteAddress(address.id)} // Handle address deletion
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No addresses found.</p>
          )}

          <form
            className="edit-form-address wd-form-address"
            id="formeditAddress"
            onSubmit={(e) => e.preventDefault()}
            style={activeAdd ? { display: "block" } : { display: "none" }}
          >
            <div className="title">Edit address</div>
            <div className="box-field grid-2-lg">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="firstnameEdit"
                  name="first name"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="firstnameEdit"
                >
                  First name
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="lastnameEdit"
                  name="last name"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="lastnameEdit"
                >
                  Last name
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="companyEdit"
                  name="company"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="companyEdit"
                >
                  Company
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="addressEdit"
                  name="address"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="addressEdit"
                >
                  Address
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="cityEdit"
                  name="city"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="cityEdit"
                >
                  City
                </label>
              </div>
            </div>
            <div className="box-field">
              <label
                htmlFor="countryEdit"
                className="mb_10 fw-4 text-start d-block text_black-2"
              >
                Country/Region
              </label>
              <div className="select-custom">
                <select
                  className="tf-select w-100"
                  id="countryEdit"
                  name="address[country]"
                  data-default=""
                >
                  <option value="---" data-provinces="[]">
                    ---
                  </option>
                  <option
                    value="Australia"
                    data-provinces="[['Australian Capital Territory','Australian Capital Territory'],['New South Wales','New South Wales'],['Northern Territory','Northern Territory'],['Queensland','Queensland'],['South Australia','South Australia'],['Tasmania','Tasmania'],['Victoria','Victoria'],['Western Australia','Western Australia']]"
                  >
                    Australia
                  </option>
                  <option value="Austria" data-provinces="[]">
                    Austria
                  </option>
                  <option value="Belgium" data-provinces="[]">
                    Belgium
                  </option>
                  <option
                    value="Canada"
                    data-provinces="[['Alberta','Alberta'],['British Columbia','British Columbia'],['Manitoba','Manitoba'],['New Brunswick','New Brunswick'],['Newfoundland and Labrador','Newfoundland and Labrador'],['Northwest Territories','Northwest Territories'],['Nova Scotia','Nova Scotia'],['Nunavut','Nunavut'],['Ontario','Ontario'],['Prince Edward Island','Prince Edward Island'],['Quebec','Quebec'],['Saskatchewan','Saskatchewan'],['Yukon','Yukon']]"
                  >
                    Canada
                  </option>
                  <option value="Czech Republic" data-provinces="[]">
                    Czechia
                  </option>
                  <option value="Denmark" data-provinces="[]">
                    Denmark
                  </option>
                  <option value="Finland" data-provinces="[]">
                    Finland
                  </option>
                  <option value="France" data-provinces="[]">
                    France
                  </option>
                  <option value="Germany" data-provinces="[]">
                    Germany
                  </option>
                  <option
                    value="Hong Kong"
                    data-provinces="[['Hong Kong Island','Hong Kong Island'],['Kowloon','Kowloon'],['New Territories','New Territories']]"
                  >
                    Hong Kong SAR
                  </option>
                  <option
                    value="Ireland"
                    data-provinces="[['Carlow','Carlow'],['Cavan','Cavan'],['Clare','Clare'],['Cork','Cork'],['Donegal','Donegal'],['Dublin','Dublin'],['Galway','Galway'],['Kerry','Kerry'],['Kildare','Kildare'],['Kilkenny','Kilkenny'],['Laois','Laois'],['Leitrim','Leitrim'],['Limerick','Limerick'],['Longford','Longford'],['Louth','Louth'],['Mayo','Mayo'],['Meath','Meath'],['Monaghan','Monaghan'],['Offaly','Offaly'],['Roscommon','Roscommon'],['Sligo','Sligo'],['Tipperary','Tipperary'],['Waterford','Waterford'],['Westmeath','Westmeath'],['Wexford','Wexford'],['Wicklow','Wicklow']]"
                  >
                    Ireland
                  </option>
                  <option value="Israel" data-provinces="[]">
                    Israel
                  </option>
                  <option
                    value="Italy"
                    data-provinces="[['Agrigento','Agrigento'],['Alessandria','Alessandria'],['Ancona','Ancona'],['Aosta','Aosta Valley'],['Arezzo','Arezzo'],['Ascoli Piceno','Ascoli Piceno'],['Asti','Asti'],['Avellino','Avellino'],['Bari','Bari'],['Barletta-Andria-Trani','Barletta-Andria-Trani'],['Belluno','Belluno'],['Benevento','Benevento'],['Bergamo','Bergamo'],['Biella','Biella'],['Bologna','Bologna'],['Bolzano','South Tyrol'],['Brescia','Brescia'],['Brindisi','Brindisi'],['Cagliari','Cagliari'],['Caltanissetta','Caltanissetta'],['Campobasso','Campobasso'],['Carbonia-Iglesias','Carbonia-Iglesias'],['Caserta','Caserta'],['Catania','Catania'],['Catanzaro','Catanzaro'],['Chieti','Chieti'],['Como','Como'],['Cosenza','Cosenza'],['Cremona','Cremona'],['Crotone','Crotone'],['Cuneo','Cuneo'],['Enna','Enna'],['Fermo','Fermo'],['Ferrara','Ferrara'],['Firenze','Florence'],['Foggia','Foggia'],['Forlì-Cesena','Forlì-Cesena'],['Frosinone','Frosinone'],['Genova','Genoa'],['Gorizia','Gorizia'],['Grosseto','Grosseto'],['Imperia','Imperia'],['Isernia','Isernia'],['L'Aquila','L’Aquila'],['La Spezia','La Spezia'],['Latina','Latina'],['Lecce','Lecce'],['Lecco','Lecco'],['Livorno','Livorno'],['Lodi','Lodi'],['Lucca','Lucca'],['Macerata','Macerata'],['Mantova','Mantua'],['Massa-Carrara','Massa and Carrara'],['Matera','Matera'],['Medio Campidano','Medio Campidano'],['Messina','Messina'],['Milano','Milan'],['Modena','Modena'],['Monza e Brianza','Monza and Brianza'],['Napoli','Naples'],['Novara','Novara'],['Nuoro','Nuoro'],['Ogliastra','Ogliastra'],['Olbia-Tempio','Olbia-Tempio'],['Oristano','Oristano'],['Padova','Padua'],['Palermo','Palermo'],['Parma','Parma'],['Pavia','Pavia'],['Perugia','Perugia'],['Pesaro e Urbino','Pesaro and Urbino'],['Pescara','Pescara'],['Piacenza','Piacenza'],['Pisa','Pisa'],['Pistoia','Pistoia'],['Pordenone','Pordenone'],['Potenza','Potenza'],['Prato','Prato'],['Ragusa','Ragusa'],['Ravenna','Ravenna'],['Reggio Calabria','Reggio Calabria'],['Reggio Emilia','Reggio Emilia'],['Rieti','Rieti'],['Rimini','Rimini'],['Roma','Rome'],['Rovigo','Rovigo'],['Salerno','Salerno'],['Sassari','Sassari'],['Savona','Savona'],['Siena','Siena'],['Siracusa','Syracuse'],['Sondrio','Sondrio'],['Taranto','Taranto'],['Teramo','Teramo'],['Terni','Terni'],['Torino','Turin'],['Trapani','Trapani'],['Trento','Trentino'],['Treviso','Treviso'],['Trieste','Trieste'],['Udine','Udine'],['Varese','Varese'],['Venezia','Venice'],['Verbano-Cusio-Ossola','Verbano-Cusio-Ossola'],['Vercelli','Vercelli'],['Verona','Verona'],['Vibo Valentia','Vibo Valentia'],['Vicenza','Vicenza'],['Viterbo','Viterbo']]"
                  >
                    Italy
                  </option>
                  <option
                    value="Japan"
                    data-provinces="[['Aichi','Aichi'],['Akita','Akita'],['Aomori','Aomori'],['Chiba','Chiba'],['Ehime','Ehime'],['Fukui','Fukui'],['Fukuoka','Fukuoka'],['Fukushima','Fukushima'],['Gifu','Gifu'],['Gunma','Gunma'],['Hiroshima','Hiroshima'],['Hokkaidō','Hokkaido'],['Hyōgo','Hyogo'],['Ibaraki','Ibaraki'],['Ishikawa','Ishikawa'],['Iwate','Iwate'],['Kagawa','Kagawa'],['Kagoshima','Kagoshima'],['Kanagawa','Kanagawa'],['Kumamoto','Kumamoto'],['Kyōto','Kyoto'],['Kōchi','Kochi'],['Mie','Mie'],['Miyagi','Miyagi'],['Miyazaki','Miyazaki'],['Nagano','Nagano'],['Nagasaki','Nagasaki'],['Nara','Nara'],['Niigata','Niigata'],['Okayama','Okayama'],['Okinawa','Okinawa'],['Saga','Saga'],['Saitama','Saitama'],['Shiga','Shiga'],['Shimane','Shimane'],['Shizuoka','Shizuoka'],['Tochigi','Tochigi'],['Tokushima','Tokushima'],['Tottori','Tottori'],['Toyama','Toyama'],['Tōkyō','Tokyo'],['Wakayama','Wakayama'],['Yamagata','Yamagata'],['Yamaguchi','Yamaguchi'],['Yamanashi','Yamanashi'],['Ōita','Oita'],['Ōsaka','Osaka']]"
                  >
                    Japan
                  </option>
                  <option
                    value="Malaysia"
                    data-provinces="[['Johor','Johor'],['Kedah','Kedah'],['Kelantan','Kelantan'],['Kuala Lumpur','Kuala Lumpur'],['Labuan','Labuan'],['Melaka','Malacca'],['Negeri Sembilan','Negeri Sembilan'],['Pahang','Pahang'],['Penang','Penang'],['Perak','Perak'],['Perlis','Perlis'],['Putrajaya','Putrajaya'],['Sabah','Sabah'],['Sarawak','Sarawak'],['Selangor','Selangor'],['Terengganu','Terengganu']]"
                  >
                    Malaysia
                  </option>
                  <option value="Netherlands" data-provinces="[]">
                    Netherlands
                  </option>
                  <option
                    value="New Zealand"
                    data-provinces="[['Auckland','Auckland'],['Bay of Plenty','Bay of Plenty'],['Canterbury','Canterbury'],['Chatham Islands','Chatham Islands'],['Gisborne','Gisborne'],['Hawke's Bay','Hawke’s Bay'],['Manawatu-Wanganui','Manawatū-Whanganui'],['Marlborough','Marlborough'],['Nelson','Nelson'],['Northland','Northland'],['Otago','Otago'],['Southland','Southland'],['Taranaki','Taranaki'],['Tasman','Tasman'],['Waikato','Waikato'],['Wellington','Wellington'],['West Coast','West Coast']]"
                  >
                    New Zealand
                  </option>
                  <option value="Norway" data-provinces="[]">
                    Norway
                  </option>
                  <option value="Poland" data-provinces="[]">
                    Poland
                  </option>
                  <option
                    value="Portugal"
                    data-provinces="[['Aveiro','Aveiro'],['Açores','Azores'],['Beja','Beja'],['Braga','Braga'],['Bragança','Bragança'],['Castelo Branco','Castelo Branco'],['Coimbra','Coimbra'],['Faro','Faro'],['Guarda','Guarda'],['Leiria','Leiria'],['Lisboa','Lisbon'],['Madeira','Madeira'],['Portalegre','Portalegre'],['Porto','Porto'],['Santarém','Santarém'],['Setúbal','Setúbal'],['Viana do Castelo','Viana do Castelo'],['Vila Real','Vila Real'],['Viseu','Viseu'],['Évora','Évora']]"
                  >
                    Portugal
                  </option>
                  <option value="Singapore" data-provinces="[]">
                    Singapore
                  </option>
                  <option
                    value="South Korea"
                    data-provinces="[['Busan','Busan'],['Chungbuk','North Chungcheong'],['Chungnam','South Chungcheong'],['Daegu','Daegu'],['Daejeon','Daejeon'],['Gangwon','Gangwon'],['Gwangju','Gwangju City'],['Gyeongbuk','North Gyeongsang'],['Gyeonggi','Gyeonggi'],['Gyeongnam','South Gyeongsang'],['Incheon','Incheon'],['Jeju','Jeju'],['Jeonbuk','North Jeolla'],['Jeonnam','South Jeolla'],['Sejong','Sejong'],['Seoul','Seoul'],['Ulsan','Ulsan']]"
                  >
                    South Korea
                  </option>
                  <option
                    value="Spain"
                    data-provinces="[['A Coruña','A Coruña'],['Albacete','Albacete'],['Alicante','Alicante'],['Almería','Almería'],['Asturias','Asturias Province'],['Badajoz','Badajoz'],['Balears','Balears Province'],['Barcelona','Barcelona'],['Burgos','Burgos'],['Cantabria','Cantabria Province'],['Castellón','Castellón'],['Ceuta','Ceuta'],['Ciudad Real','Ciudad Real'],['Cuenca','Cuenca'],['Cáceres','Cáceres'],['Cádiz','Cádiz'],['Córdoba','Córdoba'],['Girona','Girona'],['Granada','Granada'],['Guadalajara','Guadalajara'],['Guipúzcoa','Gipuzkoa'],['Huelva','Huelva'],['Huesca','Huesca'],['Jaén','Jaén'],['La Rioja','La Rioja Province'],['Las Palmas','Las Palmas'],['León','León'],['Lleida','Lleida'],['Lugo','Lugo'],['Madrid','Madrid Province'],['Melilla','Melilla'],['Murcia','Murcia'],['Málaga','Málaga'],['Navarra','Navarra'],['Ourense','Ourense'],['Palencia','Palencia'],['Pontevedra','Pontevedra'],['Salamanca','Salamanca'],['Santa Cruz de Tenerife','Santa Cruz de Tenerife'],['Segovia','Segovia'],['Sevilla','Seville'],['Soria','Soria'],['Tarragona','Tarragona'],['Teruel','Teruel'],['Toledo','Toledo'],['Valencia','Valencia'],['Valladolid','Valladolid'],['Vizcaya','Biscay'],['Zamora','Zamora'],['Zaragoza','Zaragoza'],['Álava','Álava'],['Ávila','Ávila']]"
                  >
                    Spain
                  </option>
                  <option value="Sweden" data-provinces="[]">
                    Sweden
                  </option>
                  <option value="Switzerland" data-provinces="[]">
                    Switzerland
                  </option>
                  <option
                    value="United Arab Emirates"
                    data-provinces="[['Abu Dhabi','Abu Dhabi'],['Ajman','Ajman'],['Dubai','Dubai'],['Fujairah','Fujairah'],['Ras al-Khaimah','Ras al-Khaimah'],['Sharjah','Sharjah'],['Umm al-Quwain','Umm al-Quwain']]"
                  >
                    United Arab Emirates
                  </option>
                  <option
                    value="United Kingdom"
                    data-provinces="[['British Forces','British Forces'],['England','England'],['Northern Ireland','Northern Ireland'],['Scotland','Scotland'],['Wales','Wales']]"
                  >
                    United Kingdom
                  </option>
                  <option
                    value="United States"
                    data-provinces="[['Alabama','Alabama'],['Alaska','Alaska'],['American Samoa','American Samoa'],['Arizona','Arizona'],['Arkansas','Arkansas'],['Armed Forces Americas','Armed Forces Americas'],['Armed Forces Europe','Armed Forces Europe'],['Armed Forces Pacific','Armed Forces Pacific'],['California','California'],['Colorado','Colorado'],['Connecticut','Connecticut'],['Delaware','Delaware'],['District of Columbia','Washington DC'],['Federated States of Micronesia','Micronesia'],['Florida','Florida'],['Georgia','Georgia'],['Guam','Guam'],['Hawaii','Hawaii'],['Idaho','Idaho'],['Illinois','Illinois'],['Indiana','Indiana'],['Iowa','Iowa'],['Kansas','Kansas'],['Kentucky','Kentucky'],['Louisiana','Louisiana'],['Maine','Maine'],['Marshall Islands','Marshall Islands'],['Maryland','Maryland'],['Massachusetts','Massachusetts'],['Michigan','Michigan'],['Minnesota','Minnesota'],['Mississippi','Mississippi'],['Missouri','Missouri'],['Montana','Montana'],['Nebraska','Nebraska'],['Nevada','Nevada'],['New Hampshire','New Hampshire'],['New Jersey','New Jersey'],['New Mexico','New Mexico'],['New York','New York'],['North Carolina','North Carolina'],['North Dakota','North Dakota'],['Northern Mariana Islands','Northern Mariana Islands'],['Ohio','Ohio'],['Oklahoma','Oklahoma'],['Oregon','Oregon'],['Palau','Palau'],['Pennsylvania','Pennsylvania'],['Puerto Rico','Puerto Rico'],['Rhode Island','Rhode Island'],['South Carolina','South Carolina'],['South Dakota','South Dakota'],['Tennessee','Tennessee'],['Texas','Texas'],['Utah','Utah'],['Vermont','Vermont'],['Virgin Islands','U.S. Virgin Islands'],['Virginia','Virginia'],['Washington','Washington'],['West Virginia','West Virginia'],['Wisconsin','Wisconsin'],['Wyoming','Wyoming']]"
                  >
                    United States
                  </option>
                  <option value="Vietnam" data-provinces="[]">
                    Vietnam
                  </option>
                </select>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="province"
                  name="province"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="province"
                >
                  Province
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="AddressZipNew"
                  name="AddressZipNew"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="AddressZipNew"
                >
                  Postal/ZIP code
                </label>
              </div>
            </div>
            <div className="box-field">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="phone"
                  name="phone"
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
              </div>
            </div>
            <div className="box-field text-start">
              <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8">
                <input
                  type="checkbox"
                  id="check-edit-address"
                  className="tf-check"
                />
                <label
                  htmlFor="check-edit-address"
                  className="text_black-2 fw-4"
                >
                  Set as default address.
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-20">
              <button
                type="button"
                className="tf-btn btn-fill animate-hover-btn"
              >
                Update address
              </button>
              <span
                className="tf-btn btn-fill animate-hover-btn btn-hide-edit-address"
                onClick={() => setactiveAdd(false)}
              >
                Cancel
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
