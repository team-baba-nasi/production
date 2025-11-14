// グループのオーナー
export type GroupOwner = {
    id: string | number;
    username: string;
};

export type Group = {
    id: string | number;
    name: string;
    description?: string | null;
    icon_image_url?: string | null;
    status?: string;
    created_at: string;
    owner: GroupOwner;
    role?: string;
};

export type CreateGroupForm = {
    name: string;
    description?: string;
    icon_image_url?: string;
};

export type CreateGroupResponse = {
    group: Group;
};

export type CreateGroupError = {
    error: string;
    details?: { field: string; message: string }[];
};

export type GroupsResponse = {
    groups: {
        role: string;
        group: Group;
    }[];
};

export type GroupsError = {
    error: string;
};
