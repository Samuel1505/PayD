import React, { useEffect, useState } from "react";
import { AutosaveIndicator } from "../components/AutosaveIndicator";
import { useAutosave } from "../hooks/useAutosave";
import { generateWallet } from "../services/stellar";
import {
  Button,
  Card,
  Input,
  Select,
  Alert,
} from "@stellar/design-system";

interface EmployeeFormState {
  fullName: string;
  walletAddress: string;
  role: string;
  currency: string;
}

const initialFormState: EmployeeFormState = {
  fullName: "",
  walletAddress: "",
  role: "contractor",
  currency: "USDC",
};

export default function EmployeeEntry() {
  const [formData, setFormData] = useState<EmployeeFormState>(initialFormState);
  const [notification, setNotification] = useState<{
    message: string;
    secretKey?: string;
  } | null>(null);

  // Use the autosave hook
  const { saving, lastSaved, loadSavedData } = useAutosave<EmployeeFormState>(
    "employee-entry-draft",
    formData
  );

  // Load saved data on mount
  useEffect(() => {
    const saved = loadSavedData();
    if (saved) {
      setFormData(saved);
    }
  }, [loadSavedData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle unregistered user logic
    let generatedWallet: { publicKey: string; secretKey: string } | undefined;
    if (!formData.walletAddress) {
      generatedWallet = generateWallet();
      setFormData((prev) => ({
        ...prev,
        walletAddress: generatedWallet!.publicKey,
      }));
    }

    const submitData = {
      ...formData,
      walletAddress: generatedWallet
        ? generatedWallet.publicKey
        : formData.walletAddress,
    };

    console.log("Form submitted, employee saved:", submitData);

    // Simulate Notification to the Employee
    setNotification({
      message: `Employee ${submitData.fullName} added successfully! ${
        generatedWallet ? "A wallet was created for them." : ""
      }`,
      secretKey: generatedWallet?.secretKey,
    });

    // clearSavedData();
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Add New Employee
        </h1>
        <AutosaveIndicator saving={saving} lastSaved={lastSaved} />
      </div>

      {notification && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Alert variant="success" title="Success" placement="inline">
            {notification.message}
          </Alert>
          {notification.secretKey && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "1rem",
                backgroundColor: "var(--color-yellow-100)",
                color: "var(--color-yellow-900)",
                borderRadius: "8px",
                border: "1px solid var(--color-yellow-300)",
                fontSize: "0.875rem",
              }}
            >
              <strong style={{ display: "block", marginBottom: "0.5rem" }}>
                [SIMULATED EMAIL NOTIFICATION TO EMPLOYEE]
              </strong>
              Hello {formData.fullName}, your employer has added you to the
              payroll.
              <br />
              A default Stellar wallet has been created for you to receive
              claimable balances.
              <br />
              <b style={{ display: "block", marginTop: "0.5rem" }}>
                Your Secret Key:
              </b>{" "}
              <code style={{ wordBreak: "break-all" }}>
                {notification.secretKey}
              </code>
              <br />
              <i style={{ display: "block", marginTop: "0.5rem" }}>
                Please save this secret key securely to claim your future salary.
              </i>
            </div>
          )}
        </div>
      )}

      <Card>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <Input
            id="fullName"
            fieldSize="md"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Jane Smith"
            required
          />

          <Input
            id="walletAddress"
            fieldSize="md"
            label="Stellar Wallet Address (Optional)"
            note="If no wallet is provided, a claimable balance will be created using a new wallet generated for them."
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            placeholder="Leave blank to generate a wallet"
          />

          <Select
            id="role"
            fieldSize="md"
            label="Role"
            value={formData.role}
            onChange={(e) => handleSelectChange("role", e.target.value)}
          >
            <option value="contractor">Contractor</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
          </Select>

          <Select
            id="currency"
            fieldSize="md"
            label="Preferred Currency"
            value={formData.currency}
            onChange={(e) => handleSelectChange("currency", e.target.value)}
          >
            <option value="USDC">USDC</option>
            <option value="XLM">XLM</option>
            <option value="EURC">EURC</option>
          </Select>

          <Button type="submit" variant="primary" size="md">
            Add Employee
          </Button>
        </form>
      </Card>
    </div>
  );
}
