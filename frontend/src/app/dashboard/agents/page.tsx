"use client"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Loader2, Copy, Settings, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import CreateAgentModal from "@/components/shared/dashboard/agent/CreateAgentModal"
import { agentsAPI } from "@/lib/api"
import type { Agent } from "@/types/agents"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface DisplayAgent {
    id: number
    name: string
    status: string
    lastModified: string
    conversationsHandled: number
}

// Function to transform API agent data to display format
function transformAgentForDisplay(agent: Agent): DisplayAgent {
    // Determine status based on chat_url availability
    let status = "Inactive"
    if (agent.chat_url && agent.chat_url.trim() !== "") {
        status = "Active"
    }

    // Format last modified date
    const lastModified = agent.updated_at
        ? new Date(agent.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        : new Date(agent.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })

    // Calculate conversations handled from chat sessions
    const conversationsHandled = agent.chat_sessions.length

    return {
        id: agent.id,
        name: agent.name,
        status,
        lastModified,
        conversationsHandled
    }
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case "Active":
            return "default"
        case "Inactive":
            return "secondary"
        case "Draft":
            return "outline"
        default:
            return "secondary"
    }
}

function LoadingSkeleton() {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-750">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agent Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Modified
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Conversations Handled
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chat URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <tr key={index} className="hover:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-4 w-32 bg-gray-700" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-16 bg-gray-700" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-4 w-20 bg-gray-700" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-4 w-16 bg-gray-700" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-8 w-20 bg-gray-700" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-8 w-8 bg-gray-700" />
                                        <Skeleton className="h-8 w-8 bg-gray-700" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<DisplayAgent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [agentToDelete, setAgentToDelete] = useState<DisplayAgent | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [chatUrlModalOpen, setChatUrlModalOpen] = useState(false)
    const [selectedAgentForUrl, setSelectedAgentForUrl] = useState<DisplayAgent | null>(null)
    const [generatedUrl, setGeneratedUrl] = useState<string>("")
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)
    const [urlGenerated, setUrlGenerated] = useState(false)
    const [addingChatUrl, setAddingChatUrl] = useState(false)
    const [deletingChatUrl, setDeletingChatUrl] = useState(false)

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await agentsAPI.getAgents()
            if (response.success && response.data) {
                const transformedAgents = response.data.map(transformAgentForDisplay)
                setAgents(transformedAgents)
            } else {
                setError("Failed to fetch agents")
            }
        } catch (err) {
            console.error("Error fetching agents:", err)
            setError("Failed to fetch agents. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        fetchAgents()
    }

    const handleDeleteClick = (agent: DisplayAgent) => {
        setAgentToDelete(agent)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!agentToDelete) return

        try {
            setDeleting(true)
            await agentsAPI.deleteAgent(agentToDelete.id)
            // Remove the deleted agent from the list
            setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentToDelete.id))
            setDeleteDialogOpen(false)
            setAgentToDelete(null)
        } catch (err) {
            console.error("Error deleting agent:", err)
            setError("Failed to delete agent. Please try again.")
        } finally {
            setDeleting(false)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
        setAgentToDelete(null)
    }

    const handleChatUrlClick = (agent: DisplayAgent) => {
        setSelectedAgentForUrl(agent)
        setChatUrlModalOpen(true)
    }

    const handleCloseChatUrlModal = () => {
        setChatUrlModalOpen(false)
        setSelectedAgentForUrl(null)
        setGeneratedUrl("")
        setCopiedToClipboard(false)
        setUrlGenerated(false)
        setAddingChatUrl(false)
        setDeletingChatUrl(false)
    }

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url)
            setCopiedToClipboard(true)
            setTimeout(() => setCopiedToClipboard(false), 2000)
        } catch (err) {
            console.error('Failed to copy to clipboard:', err)
        }
    }

    const generateChatUrl = () => {
        // const randomId = Math.random().toString(36).substring(2, 15)
        return `http://localhost:3000/chat/${selectedAgentForUrl?.id}`
    }

    const handleGenerateUrl = async () => {
        if (!selectedAgentForUrl) return

        try {
            setAddingChatUrl(true)
            const chatUrl = generateChatUrl()
            const response = await agentsAPI.addChatUrl(selectedAgentForUrl.id, chatUrl)

            if (response.success) {
                setGeneratedUrl(chatUrl)
                setUrlGenerated(true)
                setTimeout(() => setUrlGenerated(false), 3000) // Clear after 3 seconds

                // Update the agent in the list with the new status
                setAgents(prevAgents =>
                    prevAgents.map(agent =>
                        agent.id === selectedAgentForUrl.id
                            ? { ...agent, status: "Active" }
                            : agent
                    )
                )

                // Update the selected agent for URL so the modal shows the new URL
                setSelectedAgentForUrl(prev =>
                    prev ? { ...prev, status: "Active" } : null
                )
            } else {
                console.error("Failed to add chat URL:", response.message)
                setError("Failed to generate chat URL. Please try again.")
            }
        } catch (err) {
            console.error("Error adding chat URL:", err)
            setError("Failed to generate chat URL. Please try again.")
        } finally {
            setAddingChatUrl(false)
        }
    }

    const handleDeleteUrl = async () => {
        if (!selectedAgentForUrl) return

        try {
            setDeletingChatUrl(true)
            const response = await agentsAPI.deleteChatUrl(selectedAgentForUrl.id)

            if (response.success) {
                // Clear the generated URL
                setGeneratedUrl("")

                // Update the agent in the list to remove the URL and set status to inactive
                setAgents(prevAgents =>
                    prevAgents.map(agent =>
                        agent.id === selectedAgentForUrl.id
                            ? { ...agent, status: "Inactive" }
                            : agent
                    )
                )

                // Update the selected agent for URL so the modal switches back to generate view
                setSelectedAgentForUrl(prev =>
                    prev ? { ...prev, status: "Inactive" } : null
                )
            } else {
                console.error("Failed to delete chat URL:", response.message)
                setError("Failed to delete chat URL. Please try again.")
            }
        } catch (err) {
            console.error("Error deleting chat URL:", err)
            setError("Failed to delete chat URL. Please try again.")
        } finally {
            setDeletingChatUrl(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-200">Agents</h1>
                    <p className="text-gray-600 mt-1">Manage your AI conversational agents</p>
                </div>
                <div className="flex items-center space-x-2">
                    {error && (
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            className="text-gray-300 border-gray-600 hover:bg-gray-700"
                        >
                            <Loader2 className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    )}
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Agent
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                    <p className="text-red-200">{error}</p>
                </div>
            )}

            {/* Agents Table */}
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-750">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Agent Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Conversations Handled
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chat URL
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {agents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            {error ? "Failed to load agents" : "No agents found. Create your first agent to get started."}
                                        </td>
                                    </tr>
                                ) : (
                                    agents.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{agent.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant={getStatusBadgeVariant(agent.status)}
                                                    className={
                                                        agent.status === "Active"
                                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                                            : agent.status === "Draft"
                                                                ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                                                                : "bg-gray-600 hover:bg-gray-700 text-white"
                                                    }
                                                >
                                                    {agent.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{agent.lastModified}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {agent.conversationsHandled.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleChatUrlClick(agent)}
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                                                >
                                                    <Settings className="h-4 w-4 mr-1" />
                                                    Manage
                                                </Button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                                        onClick={() => handleDeleteClick(agent)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <CreateAgentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the agent &ldquo;{agentToDelete?.name}&rdquo;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel} disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Chat URL Management Modal */}
            <Dialog open={chatUrlModalOpen} onOpenChange={setChatUrlModalOpen}>
                <DialogContent className="sm:max-w-md bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">Manage Chat URL</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {selectedAgentForUrl?.name} - Chat URL Management
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {selectedAgentForUrl && (
                            <>
                                {/* If agent has chat_url */}
                                {selectedAgentForUrl.status === "Active" ? (
                                    <div className="space-y-4">
                                        <div className="">
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Chat URL
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    value={generatedUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${selectedAgentForUrl.id}`}
                                                    readOnly
                                                    className="bg-gray-800 border-gray-600 text-gray-300"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(generatedUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${selectedAgentForUrl.id}`)}
                                                    disabled={addingChatUrl || deletingChatUrl}
                                                    className="shrink-0 bg-gray-200 cursor-pointer"
                                                >
                                                    <Copy className="h-4 w-4 text-gray-700 " />
                                                </Button>
                                            </div>
                                            {copiedToClipboard && (
                                                <p className="text-green-400 text-sm mt-1">Copied to clipboard!</p>
                                            )}
                                            {urlGenerated && (
                                                <p className="text-green-400 text-sm mt-1">✓ Chat URL generated successfully!</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 ">
                                            <Button
                                                variant="outline"
                                                onClick={handleDeleteUrl}
                                                disabled={deletingChatUrl}
                                                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                                            >
                                                {deletingChatUrl ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                )}
                                                {deletingChatUrl ? "Deleting..." : "Delete URL"}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                onClick={handleCloseChatUrlModal}
                                                disabled={deletingChatUrl}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    /* If agent doesn't have chat_url */
                                    <div className="space-y-4">
                                        <div className="text-center py-6">
                                            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-300 mb-2">
                                                No Chat URL Generated
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-4">
                                                Generate a chat URL to allow users to interact with this agent.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center space-x-3">
                                            <Button
                                                onClick={handleGenerateUrl}
                                                disabled={addingChatUrl}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                {addingChatUrl ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                )}
                                                {addingChatUrl ? "Generating..." : "Generate URL"}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                onClick={handleCloseChatUrlModal}
                                                disabled={addingChatUrl}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}