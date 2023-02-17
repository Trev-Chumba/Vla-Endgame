import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { LSAHeader } from './LSAHeader';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';
import georgiaz from '../../fonts/georgiaz.ttf'

Font.register({
    family: 'Georgia',
    fonts: [
      {
        src: Georgia,
        fontWeight: 'bold'
      }
    ]
  });
  
  Font.register({
    family: 'Georgia_bold',
    fonts: [
      {
        src: georgiab
      }
    ]
  });

  Font.register(
    {
        family:'Georgiaz',
        src: georgiaz
    }
  )


export default function LSAExport(props) {

    const bioData = props.data.bio || {}
    const associates = props.data.associates || []
    const financial = props.data.financial || []
    const agencies = props.data.agencies || []
    const secondaryInfo = props.data.secondaryInfo || []
    const employment = props.data.employment || []
    const companies = props.data.companies || []
    const integrity = props.data.integrity || []
    const residential = props.data.residential || []
    const assets = props.data.assets || []
    const liabilities = props.data.liabilities || []
    const travels = props.data.travels || []
    const caseDetails =  props.data.caseDetails || {}

    const styles = StyleSheet.create({

        page: {
            flexDirection: 'row',
            padding: 20,
            paddingHorizontal: 30,
            justifyContent: 'space-between'
        },

        sideHead: {
            height: '100%',
            width: '5%'
        },

        body: {
            flexDirection: 'column',
            width: '90%'
        },

        textSubHeader: {
            fontSize: 12,
            marginVertical: 10,
            fontFamily: 'Georgia_bold',   

        },

        textTableHeader: {
            fontSize: 12,
            fontFamily: 'Georgia_bold'
        },

        textBody: {
            fontWeight: 'normal',
            fontFamily: 'Georgia',
            fontSize: 10
        },

        table: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginHorizontal: 10,
            marginVertical: 10,
    
        },

        tr: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            margin: 0
        },

        td: {
            borderColor: 'gray',
            borderWidth: 1,
            padding: 5,
            flex: 1
        
        }

    })

    return (
        <Page size='A4' style={styles.page}>

            <Image src={'/vla/static/l_head.png'} style={styles.sideHead} fixed />

            <View style={styles.body}>
                <Text style={{right:2, position: "absolute",fontSize:9, fontFamily:'Georgia_bold', color:'red'}}>CONFIDENTIAL</Text>
                <Image style={{ marginHorizontal: 'auto', height: 70 }} src={'/vla/static/kra_logo_name.jpg'} fixed />
                <Text style={{marginHorizontal:'auto', fontSize:9, marginVertical:10, fontFamily:'Georgia_bold'}} fixed>ISO 9001:2015 CERTIFIED</Text>
                <LSAHeader data={caseDetails} />

                <Text style={styles.textSubHeader}>1.0 Executive Summary</Text>

                <Text style={styles.textBody}>
                    {caseDetails.esummary}
                </Text>

                <Text style={styles.textSubHeader}>2.0 Objective of the Lifestyle Audit</Text>

                <Text style={styles.textBody}>
                    {caseDetails.objectives}
                </Text>



                <Text style={styles.textSubHeader}>3.0 Personal Profile</Text>



                <View style={styles.table}  >
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Photo Of Subject
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Date of Photo
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Physical Description
                        </Text>

                    </View>

                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>

                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>

                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>

                        </Text>

                    </View>

                </View>



                <View style={styles.table}  wrap = {false}>
                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.subject_Name}
                        </Text>

                    </View>


                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Alias/ Street Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.street_Name}
                        </Text>

                    </View>

                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            DOB/Age
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.dob}
                        </Text>

                    </View>



                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Place of Birth
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.place_of_Birth}
                        </Text>

                    </View>

                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            ID/PP No/Passport No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.idNo}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            KRA Pin
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.kra_pin}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Occupation
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.occupation}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Gender
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.gender}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Ethnicity
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.ethnicity}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Nationality
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.nationality}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Clan
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.clan}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Family
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.family}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            County
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.county}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Division
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.division}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Location
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.location}
                        </Text>

                    </View>


                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Sub Location
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            {bioData.sub_location}
                        </Text>

                    </View>


                </View>


                <Text style={styles.textSubHeader}>3.0 Residential Addresses</Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Address
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Physical Address
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Postal Address
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Coordinates
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>
                    </View>

                    {
                        residential.map((resident) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {resident.currentAddress}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {resident.physicalAddress}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {resident.postalAddress}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {resident.coordinates}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {resident.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>

                <Text style={styles.textSubHeader}>4.0 Secondary Information</Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Person Type
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            ID No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            KRA Pin
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Date of birth
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>
                    </View>

                    {
                        secondaryInfo.map((info) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.type}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.name}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.id_no}
                                    </Text>


                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.kra_pin}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.dob}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }

                </View>



                <Text style={styles.textSubHeader}>5.0 Associates Profile</Text>

                <View style={styles.table}>
                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            ID No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            KRA Pin
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Relationship
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>
                    </View>


                    {
                        associates.map((info) => {
                            return (
                                <View style={styles.tr}>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.name}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.idNO}
                                    </Text>


                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.kraPin}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.relationship}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>



                <Text style={styles.textSubHeader}>7.0 Financial Profile</Text>

                <Text style={styles.textSubHeader}>7.0.1 Wealth Declaration - DAILS</Text>

                <View style={styles.table}>
                    <View style={styles.tr} wrap = {false} >
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Type of Asset
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Value
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Description
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>

                    </View>

                    {
                        assets.map((info) => {
                            return (
                                <View style={styles.tr}>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.type}
                                    </Text>


                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.estValue}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.description}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {info.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>



                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            S/No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Description
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Approximate Amount
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Date of declaration
                        </Text>


                    </View>



                </View>



                <Text style={styles.textSubHeader}>7.0.2 Salaries and Remunerations</Text>

                <Text>
                    {caseDetails.salaries}
                </Text>


                <Text style={styles.textSubHeader}>7.0.3 Summary of Accounts Identified</Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Bank/Sacco/Telco Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Account Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Account Number
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Account Type
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Current Balance
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Date of Enquiry
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>


                    </View>

                    {
                        financial.map((finItem) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                      { finItem.serviceProvider}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                    { finItem.accountName}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                    { finItem.accountNumber}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                     { finItem.accountType}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                    { finItem.balances}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                     { finItem.dateOfInquiry }
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                      { finItem.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>


                <Text style={styles.textSubHeader}>8.0 Companies/Business Interests</Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Company Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Registration Number
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Date of Registration
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Relationship with Subject
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>


                    </View>

                    {
                        companies.map((finItem) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                      { finItem.companyName }
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                    { finItem.regNo }
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        { finItem.dateofReg }
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        { finItem.relationship}
                                    </Text>


                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                    { finItem.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>


                <Text style={styles.textSubHeader}>9.0 Assets</Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            S/No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Description of Assets
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Estimation Acquisition Value
                        </Text>


                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>


                    </View>

                    {
                        assets.map((asset, index) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {index}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.description}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.estValue}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>



                <Text style={styles.textSubHeader}>9.0 Liabilities</Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            S/No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Description of Liability
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Estimation Acquisition Value
                        </Text>


                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>


                    </View>

                    {
                        liabilities.map((asset, index) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {index}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.description}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.estValue}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>



                <Text style={styles.textSubHeader}>11.0 Integrity and Ethical Issues </Text>

                <View style={styles.table} wrap = {false}>
                    <View style={styles.tr}>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            S/No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Type of Offense
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Details
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Action Taken
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>


                    </View>

                    {
                        agencies.map((asset, index) => {
                            return (
                                <View style={styles.tr}>
                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {index}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.offence}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.details}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.findings}
                                    </Text>

                                    <Text style={{ ...styles.td, ...styles.textBody }}>
                                        {asset.remarks}
                                    </Text>
                                </View>
                            )
                        })
                    }


                </View>


                <Text style={styles.textSubHeader}>11.0 Lifestyle Audit Findings </Text>
                <Text style={styles.textBody}>{caseDetails.findings} </Text>



                <Text style={{ marginTop: 'auto', marginHorizontal: 'auto', fontFamily:'Georgiaz', fontSize: 12, color:'red' }} fixed>
                    TULIPE USHURU, TUJITEGEMEE
                </Text>

            </View>



        </Page >
    )

}