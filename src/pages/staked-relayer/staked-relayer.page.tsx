import React, { useState, useEffect } from "react";
import BitcoinTable from "./bitcoin-table/bitcoin-table";
import ReportModal from "./report-modal/report-modal";
import RegisterModal from "./register-modal/register-modal";
import { Button } from "react-bootstrap";
import BtcParachainTable from "./btc-parachain-table/btc-parachain-table";
import VaultTable from "./vault-table/vault-table";
import OracleTable from "./oracle-table/oracle-table";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import "./staked-relayer.page.scss";
import { StoreType } from "../../common/types/util.types";
import ButtonMaybePending from "../../common/components/staked-relayer/pending-button";

export default function StakedRelayerPage() {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isDeregisterPending, setDeregisterPending] = useState(false);

    const polkaBTC = useSelector((state: StoreType) => state.api);
    const stakedRelayer = useSelector((state: StoreType) => state.relayer);
    const [feesEarned, setFees] = useState(0);
    const [dotLocked, setLocked] = useState(0);
    const handleReportModalClose = () => setShowReportModal(false);
    const handleRegisterModalClose = () => setShowRegisterModal(false);

    const deregisterStakedRelayer = async () => {
        setDeregisterPending(true);
        try {
            await stakedRelayer.deregisterStakedRelayer();
            toast.success("Successfully Deregistered");
        } catch (error) {
            toast.error(error.toString());
        }
        setDeregisterPending(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC) return;

            const activeStakedRelayerId = polkaBTC.api.createType("AccountId");
            let result = await polkaBTC.stakedRelayer.getFeesEarned(activeStakedRelayerId);
            setFees(result.toNumber());

            result = await polkaBTC.stakedRelayer.getTotalStakedDOTAmount();
            setLocked(result.toNumber());
        };
        fetchData();
    });

    return (
        <div className="staked-relayer-page container-fluid">
            <div className="stacked-container">
                <div className="stacked-wrapper">
                    <div className="row">
                        <div className="title">Staked Relayer Dashboard</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">DOT Locked: {dotLocked}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Fees earned: {feesEarned}</div>
                        </div>
                    </div>
                    <Button
                        variant="outline-success"
                        className="staked-button"
                        onClick={() => setShowRegisterModal(true)}
                    >
                        Register (Lock DOT)
                    </Button>
                    <BitcoinTable></BitcoinTable>
                    <Button variant="outline-danger" className="staked-button" onClick={() => setShowReportModal(true)}>
                        Report Invalid Block
                    </Button>
                    <ReportModal onClose={handleReportModalClose} show={showReportModal}></ReportModal>
                    <RegisterModal onClose={handleRegisterModalClose} show={showRegisterModal}></RegisterModal>
                    <BtcParachainTable></BtcParachainTable>
                    <VaultTable></VaultTable>
                    <OracleTable></OracleTable>
                    <ButtonMaybePending
                        variant="outline-danger"
                        isPending={isDeregisterPending}
                        onClick={deregisterStakedRelayer}
                    >
                        Deregister
                    </ButtonMaybePending>
                    <div className="row">
                        <div className="col-12 de-note">
                            Note: You can only deregister if you are not participating in a vote.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
