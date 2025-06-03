import { taskApi } from "@/services/taskApi"
import { useState } from "react"
import { toast } from "sonner"

const useTask = () => {
    const [isLoading, setIsLoading] = useState(false)


    const getPendingUnassignedTask = async (payload: object) => {

        setIsLoading(true)
        try {
            const response = await taskApi.getAllPendingAndUnassignedTask(payload)
        } catch (error) {
            console.error("Registration error:", error)
            toast.error("An unexpected error occurred. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }
}


