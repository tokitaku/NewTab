import React from "react";
// import ExportedImage from "next-image-export-optimizer";
import styles from '@/styles/Home.module.css'
import { getUrl } from "@/utils/config";

interface Props {
    label: string;
    name: string;
    url: string;
}

export const LinkButton: React.FC<Props> = (props) => {
    const {label, name, url} = props;
    return (
        <div className={styles.linkButton}>
            <a href={url}>
            <img src={getUrl("/images/iconmonstr-"+name+".png")} alt="link_button" width={120} height={120} />
            <h3 className={styles.linkButtonLabel}>{label}</h3>
            </a>
        </div>
    );
};

