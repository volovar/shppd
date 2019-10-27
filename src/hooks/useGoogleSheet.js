import { useEffect } from "react";
import useGoogleAuth from "./useGoogleAuth";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
];

const useGoogleSheet = ({ apiKey, clientId }) => {
    const user = useGoogleAuth({ apiKey, clientId, DISCOVERY_DOCS, SCOPES });
};

export default useGoogleSheet;
