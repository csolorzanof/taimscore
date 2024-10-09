import { useState, useContext, useEffect } from 'react'
import {
    Tabs,
    Tab,
    TabsHeader,
    TabsBody,
    TabPanel,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Select,
    Option,
    Spinner,
} from '@material-tailwind/react'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { AlertsContext } from '../../components/alerts/Alerts-Context'
import { IndustryGroupDTO } from '../../DTOs/IndustryGroupDTO'
import EditIcon from '../../assets/edit.svg'
import DeleteIcon from '../../assets/delete-filled.svg'
import IndustryGroup from '../../types/IndustryGroup'
import TenantAccountExpiry from '../../DTOs/TenantAccountExpiryDTO'
import { useForm } from 'react-hook-form'

const AdminConfiguration = () => {
    const { token, user } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const [activeTab, setActiveTab] = useState(0)
    const [industryGroups, setIndustryGroups] = useState<IndustryGroup[]>([])
    const [newIndustryGroup, setNewIndustryGroup] = useState('')
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editIndustryGroup, setEditIndustryGroup] = useState('')
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loadingIndustries, setLoadingIndustries] = useState(false)
    const [accountExpirySettings, setAccountExpirySettings] =
        useState<TenantAccountExpiry | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TenantAccountExpiry>()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    useEffect(() => {
        const fetchIndustryGroups = async () => {
            try {
                setLoadingIndustries(true)
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/industrygroups`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setLoadingIndustries(false)
                if (response.status === 200) {
                    setIndustryGroups(response.data)
                } else {
                    console.error(
                        'Failed to fetch industry groups:',
                        response.statusText
                    )
                    addAlert({
                        id: 'error-fetch-industry-groups',
                        message: 'Failed to fetch industry groups',
                        severity: 'error',
                        timeout: 5,
                        handleDismiss: null,
                    })
                }
            } catch (error) {
                setLoadingIndustries(false)
                console.error('Error fetching industry groups:', error)
                addAlert({
                    id: 'error-fetch-industry-groups',
                    message: 'Failed to fetch industry groups',
                    severity: 'error',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        }

        const fetchAccountExpirySettings = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenant/${
                        user?.tenantId
                    }/accountexpiry`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setAccountExpirySettings(response.data)
                } else {
                    console.error(
                        'Failed to fetch account expiry settings:',
                        response.statusText
                    )
                    addAlert({
                        id: 'error-fetch-account-expiry-settings',
                        message: 'Failed to fetch account expiry settings',
                        severity: 'error',
                        timeout: 5,
                        handleDismiss: null,
                    })
                }
            } catch (error) {
                console.error('Error fetching account expiry settings:', error)
                addAlert({
                    id: 'error-fetch-account-expiry-settings',
                    message: 'Failed to fetch account expiry settings',
                    severity: 'error',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        }

        fetchIndustryGroups()
        fetchAccountExpirySettings()
    }, [token])

    const handleAddIndustryGroup = async () => {
        if (newIndustryGroup.trim() !== '') {
            try {
                const payload: IndustryGroupDTO = {
                    industryName: newIndustryGroup,
                    createdUserId: user?.userId as number,
                    createdDate: new Date(),
                }
                const response = await axios.post(
                    `${import.meta.env.VITE_BackendURL}/CreateIndustryGroup`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.status === 200) {
                    setIndustryGroups([...industryGroups, response.data])
                    setNewIndustryGroup('')
                } else {
                    console.error(
                        'Failed to create industry group:',
                        response.statusText
                    )
                    addAlert({
                        id: 'error-create-industry-group',
                        message: 'Failed to create industry group',
                        severity: 'error',
                        timeout: 5,
                        handleDismiss: null,
                    })
                }
            } catch (error) {
                console.error('Error creating industry group:', error)
                addAlert({
                    id: 'error-create-industry-group',
                    message: 'Failed to create industry group',
                    severity: 'error',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        }
    }

    const handleEditIndustryGroup = (index: number) => {
        setEditIndex(index)
        setEditIndustryGroup(industryGroups[index].industryName)
    }

    const handleUpdateIndustryGroup = async () => {
        if (editIndex !== null && editIndustryGroup.trim() !== '') {
            const industryGroupDTO: IndustryGroupDTO = {
                id: industryGroups[editIndex].id,
                industryName: editIndustryGroup,
                createdUserId: industryGroups[editIndex].createdUserId,
                createdDate: industryGroups[editIndex].createdDate,
                updatedUserId: user?.userId,
            }

            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_BackendURL}/UpdateIndustryGroup`,
                    industryGroupDTO,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.status === 200) {
                    const updatedGroups = [...industryGroups]
                    updatedGroups[editIndex] = response.data
                    setIndustryGroups(updatedGroups)
                    setEditIndex(null)
                    setEditIndustryGroup('')
                } else {
                    console.error(
                        'Failed to update industry group:',
                        response.statusText
                    )
                    addAlert({
                        id: 'error-update-industry-group',
                        message: 'Failed to update industry group',
                        severity: 'error',
                        timeout: 5,
                        handleDismiss: null,
                    })
                }
            } catch (error) {
                console.error('Error updating industry group:', error)
                addAlert({
                    id: 'error-update-industry-group',
                    message: 'Failed to update industry group',
                    severity: 'error',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        }
    }

    const openDeleteDialog = (index: number) => {
        setDeleteIndex(index)
        setIsDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (deleteIndex !== null) {
            try {
                const response = await axios.delete(
                    `${import.meta.env.VITE_BackendURL}/industrygroup/${
                        industryGroups[deleteIndex].id
                    }`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.status === 200) {
                    const updatedGroups = industryGroups.filter(
                        (_, i) => i !== deleteIndex
                    )
                    setIndustryGroups(updatedGroups)
                    setDeleteIndex(null)
                    setIsDialogOpen(false)
                } else {
                    console.error(
                        'Failed to delete industry group:',
                        response.statusText
                    )
                    addAlert({
                        id: 'error-delete-industry-group',
                        message: 'Failed to delete industry group',
                        severity: 'error',
                        timeout: 5,
                        handleDismiss: null,
                    })
                }
            } catch (error) {
                console.error('Error deleting industry group:', error)
                addAlert({
                    id: 'error-delete-industry-group',
                    message: 'Failed to delete industry group',
                    severity: 'error',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        }
    }

    const handleUpdateAccountExpirySettings = async (
        data: TenantAccountExpiry
    ) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BackendURL}/tenant/${
                    user?.tenantId
                }/accountexpiry`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('Account expiry settings updated successfully')
                addAlert({
                    id: 'account-expiry-settings-updated',
                    message: 'Account expiry settings updated successfully',
                    severity: 'success',
                    timeout: 5,
                    handleDismiss: null,
                })
            } else {
                console.error(
                    'Failed to update account expiry settings:',
                    response.statusText
                )
                addAlert({
                    id: 'error-update-account-expiry-settings',
                    message: 'Failed to update account expiry settings',
                    severity: 'error',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            console.error('Error updating account expiry settings:', error)
            addAlert({
                id: 'error-update-account-expiry-settings',
                message: 'Failed to update account expiry settings',
                severity: 'error',
                timeout: 5,
                handleDismiss: null,
            })
        }
    }

    // Pagination functions
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1) // Reset to first page when items per page changes
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = industryGroups.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(industryGroups.length / itemsPerPage)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Configuration</h1>
            <Tabs
                value={activeTab}
                onChange={(index: number) => setActiveTab(index)}
            >
                <TabsHeader>
                    <Tab value={0}>Account Expiry Customization</Tab>
                    <Tab value={1}>Industry Group</Tab>
                </TabsHeader>
                <TabsBody>
                    <TabPanel value={0}>
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">
                                Customization
                            </h2>
                            {!accountExpirySettings && (
                                <div>
                                    <Spinner color="blue" /> Loading...
                                </div>
                            )}
                            {accountExpirySettings && (
                                <form
                                    onSubmit={handleSubmit(
                                        handleUpdateAccountExpirySettings
                                    )}
                                >
                                    <h3>Account Expiry Notification</h3>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            First Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'accExpFirstNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.accExpFirstNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.accExpFirstNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            Second Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'accExpSecondNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.accExpSecondNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.accExpSecondNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            Third Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'accExpThirdNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.accExpThirdNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.accExpThirdNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            Fourth Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'accExpFourthNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.accExpFourthNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.accExpFourthNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-10">
                                        Process Owner Assessment Deadline
                                        Notification
                                    </h3>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            First Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'procOwnerFirstNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.procOwnerFirstNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.procOwnerFirstNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            Second Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'procOwnerSecondNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.procOwnerSecondNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.procOwnerSecondNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            Third Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'procOwnerThirdNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.procOwnerThirdNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.procOwnerThirdNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 w-64">
                                            Fourth Notification
                                        </label>
                                        <input
                                            type="number"
                                            {...register(
                                                'procOwnerFourthNotification',
                                                { required: true }
                                            )}
                                            defaultValue={
                                                accountExpirySettings.procOwnerFourthNotification
                                            }
                                            className="mt-1 block text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.procOwnerFourthNotification && (
                                            <span className="text-red-500">
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="gradient"
                                        color="green"
                                    >
                                        Update Settings
                                    </Button>
                                </form>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel value={1}>
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">
                                Industry Group
                            </h2>
                            {loadingIndustries && (
                                <div>
                                    <Spinner color="blue" /> Loading...
                                </div>
                            )}
                            {!loadingIndustries && (
                                <div>
                                    <div className="mb-4 flex flex-row gap-2">
                                        <input
                                            type="text"
                                            value={newIndustryGroup}
                                            onChange={(e) =>
                                                setNewIndustryGroup(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="New Industry Group"
                                            className="border p-2 mr-2"
                                        />
                                        <button
                                            onClick={handleAddIndustryGroup}
                                            className="bg-blue-500 text-white p-2 rounded"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <ul>
                                        {currentItems.map((group, index) => (
                                            <li
                                                key={group.id}
                                                className="mb-2 flex items-center"
                                            >
                                                {editIndex ===
                                                indexOfFirstItem + index ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                editIndustryGroup
                                                            }
                                                            onChange={(e) =>
                                                                setEditIndustryGroup(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="border p-2 mr-2"
                                                        />
                                                        <button
                                                            onClick={
                                                                handleUpdateIndustryGroup
                                                            }
                                                            className="bg-green-500 text-white p-2 rounded mr-2"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setEditIndex(
                                                                    null
                                                                )
                                                            }
                                                            className="bg-red-500 text-white p-2 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="flex-1">
                                                            {group.industryName}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleEditIndustryGroup(
                                                                    indexOfFirstItem +
                                                                        index
                                                                )
                                                            }
                                                            className="bg-gray-400 text-white p-2 rounded mr-2"
                                                        >
                                                            <img
                                                                src={EditIcon}
                                                                alt="Edit"
                                                                className="w-6 h-6"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    indexOfFirstItem +
                                                                        index
                                                                )
                                                            }
                                                            className="bg-gray-400 text-white p-2 rounded"
                                                        >
                                                            <img
                                                                src={DeleteIcon}
                                                                alt="Delete"
                                                                className="w-6 h-6"
                                                            />
                                                        </button>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 flex justify-center">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() =>
                                                        handlePageChange(i + 1)
                                                    }
                                                    className={`mx-1 px-3 py-1 rounded ${
                                                        currentPage === i + 1
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-300'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            )
                                        )}
                                    </div>
                                    <div className="mt-4 w-16">
                                        <Select
                                            label="Items per page"
                                            value={itemsPerPage.toString()}
                                            onChange={(e) => {
                                                handleItemsPerPageChange(
                                                    Number(e)
                                                )
                                            }}
                                        >
                                            <Option value="5">5</Option>
                                            <Option value="10">10</Option>
                                            <Option value="20">20</Option>
                                            <Option value="50">50</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                </TabsBody>
            </Tabs>

            <Dialog open={isDialogOpen} handler={setIsDialogOpen}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>
                    Are you sure you want to delete this industry group?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsDialogOpen(false)}
                        className="mr-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleConfirmDelete}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default AdminConfiguration
