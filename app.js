import React, { useState, useEffect, ChangeEvent } from "react";
import "./forms.css";
// import { populateAllFDDropDownLists } from "../../../dropdownLists";

interface FormData {
    name: string;
    IDno: string;
    JointFDG: boolean;
    FDGNo: string;
    ProductName: string;
    Tenure: string;
    segment: string;
    Rate: number;
    PreferentialRate: string;
    FinalRate: number;
    DebitingAccount: string;
    Amount: string;
    RenewalInstructions: string;
    PurposeOfTransaction: string;
    SourceOfFunds: string[];
    OtherFunds: string;
}

const FDPlacement: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        IDno: "",
        JointFDG: false, 
        FDGNo: "",
        ProductName: "",
        Tenure: "",
        segment: "",
        Rate: 0,
        PreferentialRate: "0",
        FinalRate: 0,
        DebitingAccount: "",
        Amount: "",
        RenewalInstructions: "",
        PurposeOfTransaction: "",
        SourceOfFunds: [],
        OtherFunds: ""
    });
    const [isOthersChecked, setIsOthersChecked] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);
    const [preferentialRateEnabled, setPreferentialRateEnabled] = useState<boolean>(false);
    const [reviewVisible, setReviewVisible] = useState<boolean>(false);

    const titleStyle: React.CSSProperties = {
        gridColumn: 'span 2'
    };
    
    useEffect(() => {
        // populateAllFDDropDownLists();
    }, []);

    useEffect(() => {
        // Simulate fetching data from TempData or other sources
        const tempSuccessMessage = ""; // Fetch this from somewhere if needed
        if (tempSuccessMessage) {
            alert(tempSuccessMessage);
            window.close();
        }
    }, []);

    useEffect(() => {
        // updateFinalRate();
        checkRequiredFields();
    }, [formData, preferentialRateEnabled]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
    ) => {
        if ('type' in e.target) {
            // This is a DOM event
            const { name, value, type } = e.target;
            const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
            setFormData({ ...formData, [name]: val });

            if (name === "PreferentialRate" && !preferentialRateEnabled) {
                setFormData(prevState => ({ ...prevState, PreferentialRate: "0" }));
            }
        } else {
            // This is our custom event object
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePreferentialRateChange = (increment: boolean) => {
        const currentValue = parseFloat(formData.PreferentialRate) || 0;
        const newValue = increment ? currentValue + 0.1 : currentValue - 0.1;
        const clampedValue = Math.max(0, Math.min(10, newValue)); // Ensure value is between 0 and 10
        handleInputChange({ target: { name: "PreferentialRate", value: clampedValue.toFixed(1) } });
    };

    const handleSourceOfFundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            SourceOfFunds: checked
                ? [...prevState.SourceOfFunds, value]
                : prevState.SourceOfFunds.filter((item) => item !== value)
        }));
    };

    const updateFinalRate = () => {
        const finalRate = formData.Rate + (preferentialRateEnabled ? parseFloat(formData.PreferentialRate.toString() || "0") : 0);
        setFormData((prevState) => ({ ...prevState, FinalRate: parseFloat(finalRate.toFixed(2)) }));
    };

    const checkRequiredFields = () => {
        const requiredFieldsFilled = formData.name && formData.IDno && formData.ProductName && formData.Tenure && formData.segment && formData.Rate && formData.DebitingAccount && formData.Amount && formData.RenewalInstructions && formData.PurposeOfTransaction;
        const sourceOfFundsSelected = formData.SourceOfFunds.length > 0 || (isOthersChecked && formData.OtherFunds);

        // setNextButtonDisabled(!requiredFieldsFilled || !sourceOfFundsSelected);
        // setNextButtonDisabled(!requiredFieldsFilled);
        setNextButtonDisabled(false);
    };

    const handleNextClick = () => {
        if (!nextButtonDisabled) {
            setReviewVisible(true);
        }
    };

    const handleBackClick = () => {
        setReviewVisible(false);
    };

    const handleSaveClick = () => {
        // Handle form submission logic
    };

    return (

        <>
            <header className="header-top">
                <div className="title-head">Fixed Deposit Placement</div>
            </header>

            <div className="container" style={{width: 980}}>
                {!reviewVisible ? (
                    <form id="fixedDepositForm" className="fixed-deposit-form">

                    <h3 className="title"  >Customer Details </h3>

                    <div className="form-group">
                        <label htmlFor="fullName">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} className="form-control" required onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newId">New MyKad/Passport/MyPR</label>
                        <input type="text" id="IDno" name="IDno" value={formData.IDno} className="form-control" required onChange={handleInputChange} />
                    </div>
                    <h3 className="title" >Fixed Deposit Placement</h3>
                    <div className="fdg-form-group">
                        <label htmlFor="jointFDG">Joint FDG</label>
                        <label className="switch">
                            <input type="checkbox" id="jointFDG" name="JointFDG" checked={formData.JointFDG} onChange={handleInputChange} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fdgNo">FDG No.</label>
                        <input type="number" id="fdgNo" name="FDGNo" value={formData.FDGNo} className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productName">Product Name</label>
                        <select id="productName" name="ProductName" className="product-dropdown">
                            {/* Map your options here */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tenure">Tenure</label>
                        <select id="tenure" name="Tenure" value={formData.Tenure} className="tenure-dropdown" onChange={handleInputChange}>
                            {/* Map your options here */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="segment">Customer Segment</label>
                        <select id="segment" name="segment" value={formData.segment} className="segment-dropdown" onChange={handleInputChange}>
                            {/* Map your options here */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rate">Rate</label>
                        <input type="text" id="rate" name="Rate" value={formData.Rate} className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="preferRate-form-group">
                        <div className="preferRate-checkbox-wrapper">
                            <input type="checkbox" id="preferentialRate" checked={preferentialRateEnabled} onChange={() => setPreferentialRateEnabled(!preferentialRateEnabled)} />
                            <label htmlFor="preferentialRate">Preferential Rate</label>
                        </div>
                        <div className="preferRate-input-wrapper">
                            <button 
                                type="button" 
                                className="decrement" 
                                onClick={() => handlePreferentialRateChange(false)}
                                disabled={!preferentialRateEnabled}
                            >
                                -
                            </button>
                            <input 
                                type="number" 
                                id="rateInput" 
                                name="PreferentialRate" 
                                value={formData.PreferentialRate} 
                                className="form-control" 
                                step="0.1" 
                                min="0"
                                max="10.0" 
                                readOnly={!preferentialRateEnabled} 
                                onChange={handleInputChange} 
                            />
                            <button 
                                type="button" 
                                className="increment" 
                                onClick={() => handlePreferentialRateChange(true)}
                                disabled={!preferentialRateEnabled}
                            >
                                +
                            </button>
                        </div>
                        <div className="preferRate-info">
                            <span className="preferRate-info-icon">i</span>
                            <span>Preferential Rate is subject to Management's approval</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="finalRate">Final Rate</label>
                        <input type="text" id="finalRate" name="FinalRate" value={formData.FinalRate} className="form-control" readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="debitingAccount">Debiting Funds from CASA</label>
                        <input type="number" id="debitingAccount" name="DebitingAccount" value={formData.DebitingAccount} className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount (RM)</label>
                        <input type="number" id="amount" name="Amount" value={formData.Amount} className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="renewalInstructions">Renewal Instructions Upon Maturity</label>
                        <select id="renewalInstructions" name="RenewalInstructions" value={formData.RenewalInstructions} className="renewal-dropdown" onChange={handleInputChange}>
                            {/* Map your options here */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="purposeOfTransaction">Purpose of Transaction</label>
                        <select id="purposeOfTransaction" name="PurposeOfTransaction" value={formData.PurposeOfTransaction} className="purpose-dropdown" onChange={handleInputChange}>
                            {/* Map your options here */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Source of Funds</label>
                        <div className="form-check-group">
                            {["Business Income", "Rental Income", "Inheritance", "Savings", "Salary", "Investment Returns", "Pension Funds"].map((option) => (
                                <div className="form-check" key={option}>
                                    <input type="checkbox" id={option} name="SourceOfFunds" value={option} className="form-check-input" onChange={handleSourceOfFundsChange} />
                                    <label htmlFor={option} className="form-check-label">{option}</label>
                                </div>
                            ))}
                            <div className="form-check">
                                <input type="checkbox" id="others" name="SourceOfFunds" value="others" className="form-check-input" checked={isOthersChecked} onChange={() => setIsOthersChecked(!isOthersChecked)} />
                                <label htmlFor="others" className="form-check-label">Others</label>
                            </div>
                            <div className="form-group" id="otherFundsContainer" style={{ display: isOthersChecked ? "block" : "none" }}>
                                <input type="text" id="otherFunds" name="OtherFunds" className="form-control" value={formData.OtherFunds} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                            <button type="button" className="next-button" style={{ width: "40%", marginTop: "20px" }} disabled={nextButtonDisabled} onClick={handleNextClick}>Next</button>
                        </div>
                    </form>
                ) : (
                    <div id="reviewSection">
                        <div className="fixed-deposit-form">
                            <h3 className="title">Customer Details</h3>
                            <div className="form-group">
                                <label htmlFor="reviewName">Name</label>
                                <span id="reviewName" className="form-control">{formData.name}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewIDno">New MyKad/Passport/MyPR</label>
                                <span id="reviewIDno" className="form-control">{formData.IDno}</span>
                            </div>
                            <h3 className="title">Fixed Deposit Placement</h3>
                            <div className="form-group">
                                <label htmlFor="reviewJointFDG">Joint FDG</label>
                                <span id="reviewJointFDG" className="form-control">{formData.JointFDG ? "Yes" : "No"}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewFDGNo">FDG No.</label>
                                <span id="reviewFDGNo" className="form-control">{formData.FDGNo}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewProductName">Product Name</label>
                                <span id="reviewProductName" className="form-control">{formData.ProductName}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewTenure">Tenure</label>
                                <span id="reviewTenure" className="form-control">{formData.Tenure}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewSegment">Customer Segment</label>
                                <span id="reviewSegment" className="form-control">{formData.segment}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewRate">Rate</label>
                                <span id="reviewRate" className="form-control">{formData.Rate}</span>
                            </div>
                            <div className="preferRate-form-group">
                                <label htmlFor="reviewPreferentialRate">Preferential Rate</label>
                                <span id="reviewPreferentialRate" className="form-control">{formData.PreferentialRate}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewFinalRate">Final Rate</label>
                                <span id="reviewFinalRate" className="form-control">{formData.FinalRate}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewDebitingAccount">Debiting Funds from CASA</label>
                                <span id="reviewDebitingAccount" className="form-control">{formData.DebitingAccount}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewAmount">Amount (RM)</label>
                                <span id="reviewAmount" className="form-control">{formData.Amount}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewRenewalInstructions">Renewal Instructions Upon Maturity</label>
                                <span id="reviewRenewalInstructions" className="form-control">{formData.RenewalInstructions}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reviewPurposeOfTransaction">Purpose of Transaction</label>
                                <span id="reviewPurposeOfTransaction" className="form-control">{formData.PurposeOfTransaction}</span>
                            </div>
                            <div className="form-group">
                                <label>Source of Funds</label>
                                <div id="reviewSourceOfFunds" className="form-control">{formData.SourceOfFunds.join(", ")}</div>
                            </div>
                            <div className="button-container">
                                <button type="button" className="back-button" onClick={handleBackClick}>Back</button>
                                <button type="submit" className="save-button" onClick={handleSaveClick}>Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default FDPlacement;
