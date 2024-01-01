import { OrganizationList } from '@clerk/nextjs'

export default function CreateOrganization() {
	return (
		<OrganizationList
			hidePersonal
			afterCreateOrganizationUrl={'/organization/:id'}
			afterSelectOrganizationUrl={'/organization/:id'}
		/>
	)
}
