// // Presentation Layer - Patient Form Component
// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/ui/card";
// import { Label } from "../../../shared/ui/label";
// import { Input } from "../../../shared/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select";
// import { Textarea } from "../../../shared/ui/textarea";
// import { Button } from "../../../shared/ui/button";
// import { RadioGroup, RadioGroupItem } from "../../../shared/ui/radio-group";
// import { Calendar } from "../../../shared/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "../../../shared/ui/popover";
// import { CalendarIcon, UserPlus, AlertCircle } from "lucide-react";
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";
// import { CreatePatientInput } from "../../../domain/usecases/patient/CreatePatient";
// import { departments, doctors } from "../../../data/mockPatients";
//
// interface PatientFormProps {
//     onSubmit: (input: CreatePatientInput) => Promise<void>;
//     loading?: boolean;
// }
//
// export function PatientForm({ onSubmit, loading = false }: PatientFormProps) {
//     const [formData, setFormData] = useState<CreatePatientInput>({
//         fullName: "",
//         dateOfBirth: new Date(),
//         gender: "male",
//         idNumber: "",
//         phoneNumber: "",
//         address: "",
//         symptoms: "",
//         department: "",
//         doctor: "",
//         insuranceType: "bhyt",
//         priority: "normal"
//     });
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         if (!formData.fullName || !formData.phoneNumber || !formData.department) {
//             return;
//         }
//
//         await onSubmit(formData);
//
//         // Reset form
//         setFormData({
//             fullName: "",
//             dateOfBirth: new Date(),
//             gender: "male",
//             idNumber: "",
//             phoneNumber: "",
//             address: "",
//             symptoms: "",
//             department: "",
//             doctor: "",
//             insuranceType: "bhyt",
//             priority: "normal"
//         });
//     };
//
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//         <UserPlus className="h-5 w-5" />
//             Đăng Ký Bệnh Nhân Mới
//     </CardTitle>
//     <CardDescription>
//     Nhập thông tin chi tiết để tiếp nhận bệnh nhân
//     </CardDescription>
//     </CardHeader>
//     <CardContent>
//     <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Thông tin cá nhân */}
//         <div className="space-y-4">
//     <h3 className="font-medium text-sm text-gray-700 border-b pb-2">
//         Thông tin cá nhân
//     </h3>
//
//     <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-2">
//     <Label htmlFor="fullName">
//         Họ và tên <span className="text-red-500">*</span>
//         </Label>
//         <Input
//     id="fullName"
//     value={formData.fullName}
//     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//     placeholder="Nguyễn Văn A"
//     required
//     />
//     </div>
//
//     <div className="space-y-2">
//     <Label htmlFor="dateOfBirth">
//         Ngày sinh <span className="text-red-500">*</span>
//     </Label>
//     <Popover>
//     <PopoverTrigger asChild>
//     <Button
//         variant="outline"
//     className="w-full justify-start text-left"
//     >
//     <CalendarIcon className="mr-2 h-4 w-4" />
//         {formData.dateOfBirth ? (
//                 format(formData.dateOfBirth, "dd/MM/yyyy", { locale: vi })
//             ) : (
//                 <span>Chọn ngày sinh</span>
// )}
//     </Button>
//     </PopoverTrigger>
//     <PopoverContent className="w-auto p-0">
//     <Calendar
//         mode="single"
//     selected={formData.dateOfBirth}
//     onSelect={(date) => date && setFormData({ ...formData, dateOfBirth: date })}
//     initialFocus
//     />
//     </PopoverContent>
//     </Popover>
//     </div>
//     </div>
//
//     <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-2">
//         <Label>Giới tính</Label>
//     <RadioGroup
//     value={formData.gender}
//     onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
//     className="flex gap-4"
//     >
//     <div className="flex items-center space-x-2">
//     <RadioGroupItem value="male" id="male" />
//     <Label htmlFor="male" className="cursor-pointer">Nam</Label>
//         </div>
//         <div className="flex items-center space-x-2">
//     <RadioGroupItem value="female" id="female" />
//     <Label htmlFor="female" className="cursor-pointer">Nữ</Label>
//         </div>
//         <div className="flex items-center space-x-2">
//     <RadioGroupItem value="other" id="other" />
//     <Label htmlFor="other" className="cursor-pointer">Khác</Label>
//         </div>
//         </RadioGroup>
//         </div>
//
//         <div className="space-y-2">
//     <Label htmlFor="idNumber">CCCD/CMND</Label>
//         <Input
//     id="idNumber"
//     value={formData.idNumber}
//     onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
//     placeholder="001234567890"
//         />
//         </div>
//         </div>
//
//         <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-2">
//     <Label htmlFor="phoneNumber">
//         Số điện thoại <span className="text-red-500">*</span>
//         </Label>
//         <Input
//     id="phoneNumber"
//     value={formData.phoneNumber}
//     onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//     placeholder="0912345678"
//     required
//     />
//     </div>
//
//     <div className="space-y-2">
//     <Label htmlFor="insuranceType">Loại BHYT</Label>
//     <Select
//     value={formData.insuranceType}
//     onValueChange={(value: any) => setFormData({ ...formData, insuranceType: value })}
// >
//     <SelectTrigger>
//         <SelectValue />
//     </SelectTrigger>
//     <SelectContent>
//     <SelectItem value="bhyt">BHYT (80%)</SelectItem>
//         <SelectItem value="private">Bảo hiểm tư nhân</SelectItem>
//     <SelectItem value="none">Không có</SelectItem>
//     </SelectContent>
//     </Select>
//     </div>
//     </div>
//
//     <div className="space-y-2">
//     <Label htmlFor="address">Địa chỉ</Label>
//     <Input
//     id="address"
//     value={formData.address}
//     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//     placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
//         />
//         </div>
//         </div>
//
//     {/* Thông tin khám bệnh */}
//     <div className="space-y-4">
//     <h3 className="font-medium text-sm text-gray-700 border-b pb-2">
//         Thông tin khám bệnh
//     </h3>
//
//     <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-2">
//     <Label htmlFor="department">
//         Khoa khám <span className="text-red-500">*</span>
//         </Label>
//         <Select
//     value={formData.department}
//     onValueChange={(value) => setFormData({ ...formData, department: value })}
//     required
//     >
//     <SelectTrigger>
//         <SelectValue placeholder="Chọn khoa" />
//         </SelectTrigger>
//         <SelectContent>
//         {departments.map((dept) => (
//                 <SelectItem key={dept} value={dept}>
//                 {dept}
//                 </SelectItem>
// ))}
//     </SelectContent>
//     </Select>
//     </div>
//
//     <div className="space-y-2">
//     <Label htmlFor="doctor">Bác sĩ</Label>
//     <Select
//     value={formData.doctor}
//     onValueChange={(value) => setFormData({ ...formData, doctor: value })}
// >
//     <SelectTrigger>
//         <SelectValue placeholder="Chọn bác sĩ" />
//         </SelectTrigger>
//         <SelectContent>
//         {doctors.map((doc) => (
//                 <SelectItem key={doc} value={doc}>
//                 {doc}
//                 </SelectItem>
// ))}
//     </SelectContent>
//     </Select>
//     </div>
//     </div>
//
//     <div className="space-y-2">
//     <Label htmlFor="symptoms">Triệu chứng / Lý do khám</Label>
//     <Textarea
//         id="symptoms"
//     value={formData.symptoms}
//     onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
//     placeholder="Mô tả triệu chứng hoặc lý do đến khám..."
//     rows={3}
//     />
//     </div>
//
//     <div className="space-y-2">
//         <Label>Mức độ ưu tiên</Label>
//     <RadioGroup
//     value={formData.priority}
//     onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
//     className="flex gap-4"
//     >
//     <div className="flex items-center space-x-2">
//     <RadioGroupItem value="normal" id="normal" />
//     <Label htmlFor="normal" className="cursor-pointer">Bình thường</Label>
//     </div>
//     <div className="flex items-center space-x-2">
//     <RadioGroupItem value="urgent" id="urgent" />
//     <Label htmlFor="urgent" className="cursor-pointer flex items-center gap-1">
//     <AlertCircle className="h-4 w-4 text-red-500" />
//         Khẩn cấp
//     </Label>
//     </div>
//     </RadioGroup>
//     </div>
//     </div>
//
//     <div className="flex gap-3 pt-4">
//     <Button type="submit" className="flex-1" disabled={loading}>
//         {loading ? "Đang xử lý..." : "Đăng ký bệnh nhân"}
//         </Button>
//         <Button
//     type="button"
//     variant="outline"
//     onClick={() => setFormData({
//         fullName: "",
//         dateOfBirth: new Date(),
//         gender: "male",
//         idNumber: "",
//         phoneNumber: "",
//         address: "",
//         symptoms: "",
//         department: "",
//         doctor: "",
//         insuranceType: "bhyt",
//         priority: "normal"
//     })}
// >
//     Xóa form
//     </Button>
//     </div>
//     </form>
//     </CardContent>
//     </Card>
// );
// }
