import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

export const LSAHeader = (props) => {

    const caseDetails  = props.data|| {}
    

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    // const caseData = props.data.caseDetails || []

    const date = Date()

    const styles = StyleSheet.create({
        Logo: {
            margin: 'auto',
            height: 30,
            width: 70
        },

        Line: {
            height: 2,
            backgroundColor: 'black',
            width: '100%',
            marginVertical: 5
        },
        Text: {
            fontSize: 10,
            marginVertical: 2
        }
    })

    return (
        <View>

            <Text style={{ ...styles.Text, margin: 'auto' }}> INTELLIGENCE &amp; STRATEGIC OPERATIONS DEPARTMENT</Text>
            <Text style={{ ...styles.Text, margin: 'auto' }}> LIFESTYLE AUDIT PROFILING REPORT </Text>

            <View style={styles.Line} />
            <Text style={styles.Text}>TO :{caseDetails.cSource}</Text>
            <Text style={styles.Text}>THRO':COMMISSIONER - INTELLIGENCE AND STRATEGIC OPERATIONS </Text>
            <Text style={styles.Text}>FROM : {caseDetails.subject}  </Text>
            <Text style={styles.Text}>REF :  {caseDetails.reference}    </Text>
            <Text style={styles.Text}>DATE : {today}   </Text>

            <View style={styles.Line} />

            <Text style={styles.Text}>INVESTIGATION REPORT ON ALLEGATIONS OF BEING IN
                POSSESSION OF UNEXPLAINED WEALTH BY </Text>
            <Text style={styles.Text}>HOD REGISTER NO -INQUIRY NO . : { caseDetails.caseNo } </Text>

            <View style={styles.Line} />

        </View>
    )

}