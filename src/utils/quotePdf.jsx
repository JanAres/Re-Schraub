import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 32,
        fontSize: 11,
        fontFamily: "Helvetica",
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontWeight: "bold",
    },
    subTitle: {
        fontSize: 11,
        marginBottom: 16,
        color: "#555",
    },
    section: {
        marginBottom: 18,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottom: "1 solid #222",
        paddingBottom: 6,
        marginBottom: 6,
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        borderBottom: "1 solid #ddd",
        paddingVertical: 6,
    },
    col1: { width: "30%" },
    col2: { width: "16%" },
    col3: { width: "20%" },
    col4: { width: "12%" },
    col5: { width: "22%", textAlign: "right" },
    total: {
        marginTop: 16,
        textAlign: "right",
        fontSize: 13,
        fontWeight: "bold",
    },
});

function parseGermanNumber(value) {
    if (!value) return 0;
    return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

function lineTotal(item) {
    const unit = parseGermanNumber(item.netPricePer100);
    const factor = parseGermanNumber(item.priceUnit) || 100;
    const perUnit = factor ? unit / factor : unit / 100;
    return perUnit * item.quantity;
}

export default function ProductsQuoteDocument({ items, total }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Angebot</Text>
                <Text style={styles.subTitle}>
                    RE-Schraub Produktangebot
                </Text>

                <View style={styles.section}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.col1}>Artikel</Text>
                        <Text style={styles.col2}>Art.-Nr.</Text>
                        <Text style={styles.col3}>EAN</Text>
                        <Text style={styles.col4}>Menge</Text>
                        <Text style={styles.col5}>Gesamt netto</Text>
                    </View>

                    {items.map((item) => (
                        <View key={item.id} style={styles.row}>
                            <Text style={styles.col1}>{item.name}</Text>
                            <Text style={styles.col2}>{item.articleNumber}</Text>
                            <Text style={styles.col3}>{item.ean}</Text>
                            <Text style={styles.col4}>{item.quantity}</Text>
                            <Text style={styles.col5}>{lineTotal(item).toFixed(2)} €</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.total}>Gesamt netto: {total.toFixed(2)} €</Text>
            </Page>
        </Document>
    );
}