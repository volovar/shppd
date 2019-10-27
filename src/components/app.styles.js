import { css } from "@emotion/core";

export const globalCss = css`
    html,
    body {
        height: 100%;
    }

    body {
        background: #333;
        color: #f1f1f1;
        font-family: sans-serif;
        margin: 0;
        padding: 0;
    }

    .root {
        height: 100%;
    }
`;

export const headerCss = css`
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
`;
