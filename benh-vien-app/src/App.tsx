

import {
    Activity,
    Users,
    ClipboardList,
    CreditCard,
    Hospital
} from "lucide-react";
import { Toaster } from "sonner";
import {Tabs} from "@radix-ui/react-tabs";
import {TabsContent, TabsList, TabsTrigger} from "./shared/ui/tabs.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./shared/ui/card.tsx";


export default function App() {
    // const [activeTab, setActiveTab] = useState("patients");
    // const { patients, loading, createPatient, updateStatus } = usePatients();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Hospital className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Hệ Thống Bệnh Viện SaiGon -ITO
                            </h1>
                            <p className="text-sm text-gray-500">
                                Tiếp nhận - Dịch vụ - Thanh toán
                            </p>
                        </div>
                    </div>
                </div>
            </header>

             Main Content
            <main className="container mx-auto px-4 py-6">
                <Tabs
                    // value={activeTab}
                    // onValueChange={setActiveTab}
                    className="space-y-6">
                    {/* Navigation Tabs */}
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto h-auto p-1">
                        <TabsTrigger
                            value="dashboard"
                            className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <Activity className="h-5 w-5" />
                            <span className="text-xs">Dashboard</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="patients"
                            className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <Users className="h-5 w-5" />
                            <span className="text-xs">Bệnh nhân</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="services"
                            className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <ClipboardList className="h-5 w-5" />
                            <span className="text-xs">Dịch vụ</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="payments"
                            className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <CreditCard className="h-5 w-5" />
                            <span className="text-xs">Thanh toán</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dashboard</CardTitle>
                                <CardDescription>Tổng quan hệ thống</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Dashboard content sẽ được thêm vào sau...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Patients Tab */}
                    <TabsContent value="patients" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                {/*<PatientForm*/}
                                {/*    onSubmit={async (input) => {*/}
                                {/*        await createPatient(input);*/}
                                {/*    }}*/}
                                {/*    loading={loading}*/}
                                {/*/>*/}
                            </div>
                            <div className="lg:col-span-2">
                                {/*<PatientList*/}
                                {/*    patients={patients}*/}
                                {/*    loading={loading}*/}
                                {/*    onStatusChange={updateStatus}*/}
                                {/*/>*/}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chỉ Định Dịch Vụ</CardTitle>
                                <CardDescription>Quản lý dịch vụ cận lâm sàng</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Service orders sẽ được thêm vào sau...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payments Tab */}
                    <TabsContent value="payments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thanh Toán</CardTitle>
                                <CardDescription>Quản lý hóa đơn và thanh toán</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Payment management sẽ được thêm vào sau...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/50 mt-12">
                <div className="container mx-auto px-4 py-4">
                    <p className="text-center text-sm text-gray-500">
                        © 2025 Hospital Management System
                    </p>
                </div>
            </footer>

            {/* Toast Notifications */}
            <Toaster position="top-right" richColors />
        </div>
    );
}
