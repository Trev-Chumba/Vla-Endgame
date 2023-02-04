import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { BcHeader } from "./BCHeader";
import { red } from "@mui/material/colors";


export default function BcAndVtExPort(props) {

    const bioData = props.data.bio || {}
    const caseDetails = props.data.caseDetails || {}


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
            width: '90%',
            
        },

        textSubHeader: {
            fontSize: 13,
            marginVertical: 10,
            fontWeight: 'demibold'
        },

        textTableHeader: {
            fontSize: 15,
            fontWeight: 'demibold'
        },

        textBody: {
            fontWeight: 'normal',
            fontSize: 10
        },

        table: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginHorizontal: 10,
            marginVertical: 10
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
            width: '20%'
        }

    })

    return (
        <Page size='A4' style={styles.page}>


            <Image src={'/vla/static/l_head.png'} style={styles.sideHead} fixed />


            <View style={styles.body}>


                <Image style={{ marginHorizontal: 'auto', height: 70 }} src={'/vla/static/kra_logo_name.jpg'} fixed />


                <BcHeader data={caseDetails}/>
                console.log("Export",caseDetails)

                <Text style={styles.textSubHeader}>1.0 Reason for Background Check</Text>

                <Text style={styles.textBody}>
                    {caseDetails.cReasons}
                </Text>

                <View style={styles.table} >
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            P/No.
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Status
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Position Applied
                        </Text>
                    </View>

                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            1
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.idNo}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.subject_Name}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {caseDetails.candidateType}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {caseDetails.position}
                        </Text>
                    </View>
                </View>

                <Text style={styles.textSubHeader}>2.0 Objective of the Background Check</Text>

                <Text style={styles.textBody}>
                    {caseDetails.objectives}
                </Text>

                <Text style={styles.textSubHeader}>3.0 Findings</Text>

                <View style={styles.table}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            P/No.
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Inquiry No.
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>
                    </View>

                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            1
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.idNo}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {caseDetails.caseNo}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.subject_Name}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {caseDetails.remarks}
                        </Text>
                    </View>
                </View>

                <Text style={styles.textSubHeader}>4.0 Recommendation</Text>

                <Text style={styles.textBody}>
                    { caseDetails.recomentation }
                </Text>


                <Text style={{ marginTop: 'auto', marginHorizontal: 'auto', fontStyle: 'italic', fontSize: 12, color: 'red'}} fixed>
                    TULIPE USHURU,TUJITEGEMEE!
                </Text>

            </View>

        </Page>
    )

}