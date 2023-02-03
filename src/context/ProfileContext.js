import React, { useState } from 'react';

export const ProfileContext = React.createContext({
    viewType: "",
    setViewType: () => {},
    profile: {},
    setProfile: () => { },
    residential: [],
    setResidential: () => { },
    employment: [],
    setEmployment: () => { },
    associates: [],
    setAssociates: () => { },
    businessInterests: [],
    setBusinessInterests: () => { },
    financialProfile: {},
    setFinancialProfile: () => { },
    assets: [],
    setAssets: () => { },
    integrityIssues: {},
    setIntegrityIssues: () => { },
    liabilities: [],
    setLiabilities: () => { },
    secondaryInformation: [],
    setSecondaryInformation: () => { },
    travels: [],
    setTravels: () => { },
    taxes:[],
    setTaxes:()=>{},
    declarations:[],
    setDeclarations:()=>{},

})

export const ProfileContextProvider = (props) => {

    const [profile, setProfile] = useState({})
    const [residential, setResidential] = useState([])
    const [employment, setEmployment] = useState([])
    const [associates, setAssociates] = useState([])
    const [businessInterests, setBusinessInterests] = useState([])
    const [financialProfile, setFinancialProfile] = useState({})
    const [assets, setAssets] = useState([])
    const [integrityIssues, setIntegrityIssues] = useState({})
    const [liabilities, setLiabilities] = useState([])
    const [secondaryInformation, setSecondaryInformation] = useState({})
    const [travels, setTravels] = useState([])
    const [taxes, setTaxes] = useState([])
    const [declarations, setDeclarations] = useState([])
    const [viewType, setViewType] = useState("SP")


    const updateProfile = (newData) => {

        setProfile(newData)
    }

    const updateResidential = (newResData) => {
        setResidential(newResData)
    }

    const updateEmplyment = (newEmpData) => {
        setEmployment(newEmpData)
    }

    const updateAssociates = (newAssoData) => {
        setAssociates(newAssoData)
    }

    const updateBusinessInterests = (newBusData) => {
        setBusinessInterests(newBusData)
    }

    const updateFinancialProfile = (newFinData) => {
        setFinancialProfile(newFinData)
    }

    const updateAssets = (newAsseData) => {
        setAssets(newAsseData)
    }

    const updateIntegrityIssues = (newInteData) => {
        setIntegrityIssues(newInteData)
    }

    const updateLiablities = (newLiaData) => {
        setLiabilities(newLiaData)
    }

    const updateSecondaryInformation = (newSecData) => {
        setSecondaryInformation(newSecData)
    }

    const updateTravels = (newTraData) => {
        setTravels(newTraData)
    }

    const updateTaxes = (newTaxData) => {
        setTaxes(newTaxData)
    }
    const updateDeclarations = (newDeclarationsData) => {
        setDeclarations(newDeclarationsData)
    }


    return (
        <ProfileContext.Provider value={{
            profile: profile, setProfile: updateProfile,
            residential: residential, setResidential: updateResidential,
            assets: assets, setAssets: updateAssets,
            associates: associates, setAssociates: updateAssociates,
            businessInterests: businessInterests, setBusinessInterests: updateBusinessInterests,
            employment: employment, setEmployment: updateEmplyment,
            financialProfile: financialProfile, setFinancialProfile: updateFinancialProfile,
            integrityIssues: integrityIssues, setIntegrityIssues: updateIntegrityIssues,
            liabilities: liabilities, setLiabilities: updateLiablities,
            secondaryInformation: secondaryInformation, setSecondaryInformation: updateSecondaryInformation,
            travels: travels, setTravels: updateTravels,
            taxes: taxes, setTaxes: updateTaxes,
            declarations: declarations, setDeclarations: updateDeclarations,

        }} >
            {props.children}
        </ProfileContext.Provider>
    )

}