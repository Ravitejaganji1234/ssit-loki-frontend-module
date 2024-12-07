

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    PlusIcon,
    UsersIcon,
    UserGroupIcon,
    BriefcaseIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/20/solid';
import ModalWrapper from '../EmployeeComponents/ModalWrapper';
import MultiStepForm from '../EmployeeComponents/MultiStepForm';
import Loader from "../Assets/Loader";
 
export default function Employee() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(7);
 
    useEffect(() => {
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
 
        if (!email || !role) {
            window.location.reload(); // Reload the entire application
 
            navigate('/login');
        } else {
            fetchEmployees();
        }
    }, [navigate]);
 
 
    const fetchEmployees = async () => {
       const token= localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await fetch('https://talents-backend.azurewebsites.net/api/v1/employeeManager/employees',{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            });
            console.log(response.data);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            console.log(data);
            setEmployees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
 
    const handleDeleteEmployee = async (id) => {
        const token= localStorage.getItem('token');
        try {
            const response = await fetch(`https://talents-backend.azurewebsites.net/api/v1/employeeManager/employees/${id}`, {
                method: 'DELETE',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            });
            if (response.ok) {
                fetchEmployees();
            } else {
                const errorData = await response.json();
                console.error('Failed to delete employee:', errorData);
            }
        } catch (error) {
            console.error('Error while deleting employee:', error);
        }
    };
 
    const handleEmployeeAdded = () => {
        fetchEmployees();
        setIsModalOpen(false);
    };
 
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
 
    const totalEmployees = employees.length;
    const totalAdmins = employees.filter(emp => emp.role === 'Admin').length;
    const totalDepartments = [...new Set(employees.map(emp => emp.department))].length;
 
    // Pagination logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(employees.length / employeesPerPage);
 
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Dashboard</h1>
 
                {/* Metrics Section */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UsersIcon className="h-9 w-9 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-lg font-bold text-gray-500 truncate">Total Employees</dt>
                                        <dd className="text-xl font-medium text-gray-900">{totalEmployees}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UserGroupIcon className="h-9 w-9 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-lg font-bold text-gray-500 truncate">Total Admins</dt>
                                        <dd className="text-xl font-medium text-gray-900">{totalAdmins}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <BriefcaseIcon className="h-9 w-9 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-lg font-bold text-gray-500 truncate">Total Departments</dt>
                                        <dd className="text-xl font-medium text-gray-900">{totalDepartments}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
 
                {/* Employee List Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h2 className="text-xl leading-6 font-bold text-gray-900">Employee List</h2>
                        {/*here*/}
 
 
                        {/*here*/}
                        <button
                            onClick={handleOpenModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Add Employee
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center py-4">
                            <Loader/>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Corporate
                                            Email
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Role</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Delete</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {currentEmployees.map((employee) => (
                                        <tr key={`${employee.corporateEmail}-${employee.firstName}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
 
                                                    <div className="ml-4">
                                                        <button
                                                            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                                                            onClick={() => navigate(`/employeedetails/${employee.employeeId}`)}
                                                        >
                                                            {employee.firstName} {employee.lastName}
                                                        </button>
                                                        <div className="text-sm text-gray-500">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg text-gray-900">{employee.corporateEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{employee.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{employee.jobRole}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900">
                                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                                <button
                                                    onClick={() => handleDeleteEmployee(employee.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
 
                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{indexOfFirstEmployee + 1}</span> to <span className="font-medium">{Math.min(indexOfLastEmployee, totalEmployees)}</span> of <span className="font-medium">{totalEmployees}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(index + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        index + 1 === currentPage
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Next</span>
                                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
 
            {/* Add Employee Modal */}
            <ModalWrapper open={isModalOpen} onClose={handleCloseModal}>
                <MultiStepForm onSubmit={handleEmployeeAdded} onCancel={handleCloseModal} />
            </ModalWrapper>
        </div>
    );
}