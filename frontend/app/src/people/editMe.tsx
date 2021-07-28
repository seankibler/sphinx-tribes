import React, { useEffect, useState } from "react";
import { useStores } from "../store";
import { useObserver } from "mobx-react-lite";
import {
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from "@elastic/eui";
import Form from "../form";
import ConfirmMe from "./confirmMe";
import type { MeInfo } from '../store/ui'
import { meSchema } from '../form/schema'
import api from '../api'


const host = window.location.host.includes("localhost")
  ? "localhost:5002"
  : window.location.host;

export default function EditMe(props: any) {
  const { ui, main } = useStores();

  const [loading, setLoading] = useState(false);

  function closeModal() {
    ui.setEditMe(false);
    ui.setMeInfo(null);
  }

  async function testChallenge(chal: string) {
    try {
      const me: MeInfo = await api.get(`poll/${chal}`)
      if (me && me.pubkey) {
        ui.setMeInfo(me)
        ui.setEditMe(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    try {
      var urlObject = new URL(window.location.href);
      var params = urlObject.searchParams;
      const chal = params.get('challenge')
      if (chal) {
        testChallenge(chal)
      }
    } catch (e) { }
  }, [])

  async function submitForm(v) {
    console.log(v);
    const info = ui.meInfo as any;
    const body = v
    body.extras = {
      ...v.twitter && { twitter: v.twitter }
    }
    if (!info) return console.log("no meInfo");
    setLoading(true);
    const URL = info.url.startsWith('http') ? info.url : `https://${info.url}`
    const r = await fetch(URL + "/profile", {
      method: "POST",
      body: JSON.stringify({
        host,
        ...body,
        price_to_meet: parseInt(v.price_to_meet),
      }),
      headers: {
        "x-jwt": info.jwt,
        "Content-Type": "application/json"
      },
    });
    if (!r.ok) {
      setLoading(false);
      return alert("Failed to create profile");
    }
    await main.getPeople();
    ui.setEditMe(false);
    ui.setMeInfo(null);
    setLoading(false);
  }
  return useObserver(() => {
    if (!ui.editMe) return <></>;

    let verb = "Create";
    if (ui.meInfo && ui.meInfo.id) verb = "Edit";

    let initialValues = {};
    if (ui.meInfo) {
      initialValues = {
        id: ui.meInfo.id || 0,
        pubkey: ui.meInfo.pubkey,
        owner_alias: ui.meInfo.alias || "",
        img: ui.meInfo.photo_url || "",
        price_to_meet: ui.meInfo.price_to_meet || 0,
        description: ui.meInfo.description || "",
        // twitter: (ui.meInfo.extras && ui.meInfo.extras.twitter) || '',
        extras: ui.meInfo.extras || {}
      };
    }

    return (
      <EuiOverlayMask>
        <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
          <EuiModalHeader>
            <EuiModalHeaderTitle>{`${verb} My Profile`}</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <div>
              {!ui.meInfo && <ConfirmMe />}
              {ui.meInfo && (
                <Form
                  paged={true}
                  loading={loading}
                  onSubmit={submitForm}
                  schema={meSchema}
                  initialValues={initialValues}
                  extraHTML={
                    ui.meInfo.verification_signature ? { twitter: `<span>Post this to your twitter account to verify:</span><br/><strong>Sphinx Verification: ${ui.meInfo.verification_signature}</strong>` } : {}
                  }
                />
              )}
            </div>
          </EuiModalBody>
        </EuiModal>
      </EuiOverlayMask>
    );
  });
}
