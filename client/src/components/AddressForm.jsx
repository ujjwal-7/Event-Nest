import { Box, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const AddressForm = ({ address, onChange, errors }) => (
  <Box mt="7">
    <Heading size="sm">Event address</Heading>
    <Flex flexDirection="column" gap="10" mt="5">
      {["street", "city"].map((field) => (
        <Flex gap="5" alignItems="center" key={field}>
          <Text>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
          <Input
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={address[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            isInvalid={!!errors[field]}
          />
          {errors[field] && <Text color="red.500">{errors[field]}</Text>}
        </Flex>
      ))}

      <Flex
        flexDirection={["column", "column", "row"]}
        justifyContent="space-between"
        gap="4"
      >
        <CountryRegionInput
          label="Country"
          value={address?.country || ""}
          onChange={(val) => onChange("country", val)}
          error={errors.country}
        />
        <CountryRegionInput
          label="State"
          value={address?.state || ""}
          country={address?.country || ""}
          onChange={(val) => onChange("state", val)}
          error={errors.state}
        />
      </Flex>

      <Flex width={["100%", "55%", "35%"]} alignItems="center">
        <Text>Postal code</Text>
        <Input
          placeholder="Postal Code"
          value={address?.postalCode || ""}
          onChange={(e) => onChange("postalCode", e.target.value)}
          isInvalid={!!errors.postalCode}
        />
        {errors.postalCode && <Text color="red.500">{errors.postalCode}</Text>}
      </Flex>
    </Flex>
  </Box>
);

const CountryRegionInput = ({ label, country, value, onChange, error }) => (
  <Flex gap="5" width={["100%", "55%", "35%"]} alignItems="center">
    <Text>{label}</Text>
    <Box flex="1">
      {label === "Country" ? (
        <CountryDropdown
          value={value}
          onChange={onChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CBD5E0",
            backgroundColor: "#EDF2F7",
            width: "100%",
          }}
        />
      ) : (
        <RegionDropdown
          country={country}
          value={value}
          onChange={onChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CBD5E0",
            backgroundColor: "#EDF2F7",
            width: "100%",
          }}
        />
      )}
      {error && <Text color="red.500">{error}</Text>}
    </Box>
  </Flex>
);

export default AddressForm;
