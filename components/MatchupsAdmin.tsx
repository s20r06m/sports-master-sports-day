"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
    userid: string;
    firstname: string | null;
    lastname: string | null;
    house: string | null;
};

type MatchupGroup = {
    name: string;
    members: string[];
};

export default function MatchupsAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [participants, setParticipants] = useState<string[]>([]);
    const [teamCount, setTeamCount] = useState(2);
    const [groups, setGroups] = useState<MatchupGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const { data } = await supabase
            .from("users")
            .select("*")
            .neq("role", "admin")
            .order("firstname");

        setUsers(data ?? []);
        setLoading(false);
    }

    function toggleParticipant(userid: string) {
        setParticipants((curr) =>
            curr.includes(userid)
                ? curr.filter((id) => id !== userid)
                : [...curr, userid]
        );
    }

    function selectAll() {
        setParticipants(users.map((u) => u.userid));
    }

    function clearAll() {
        setParticipants([]);
        setGroups([]);
    }

    function shuffle<T>(arr: T[]) {
        const a = [...arr];

        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    }

    function generateTeams() {
        const shuffled = shuffle(participants);

        const generated: MatchupGroup[] = Array.from(
            { length: teamCount },
            (_, i) => ({
                name: `Team ${i + 1}`,
                members: [],
            })
        );

        shuffled.forEach((userid, index) => {
            generated[index % teamCount].members.push(userid);
        });

        setGroups(generated);
    }

    if (loading) return <p>Loading Matchups...</p>;

    return (
        <div className="event-admin">
            <h4>Number of Teams</h4>

            <input
                type="number"
                min={0}
                max={participants.length}
                value={teamCount}
                onChange={(e) => {
                    const value = Number(e.target.value);

                    const clamped = Math.max(
                        2,
                        Math.min(value, participants.length)
                    );

                    setTeamCount(clamped);
                }}
                className="event-admin-name"
            />



            <h4>Participants</h4>

            <div className="event-admin-grid">
                {users.map((user) => {
                    const selected =
                        participants.includes(user.userid);

                    return (
                        <button
                            key={user.userid}
                            className={`event-admin-player ${selected ? "selected" : ""
                                }`}
                            onClick={() =>
                                toggleParticipant(user.userid)
                            }
                        >
                            {user.firstname} {user.lastname}
                        </button>
                    );
                })}
            </div>

            <br />
            <div className="event-admin-actions">

                <button
                    className="event-admin-select-all"
                    onClick={selectAll}
                >
                    Select All
                </button>

                <button
                    className="event-admin-select-all"
                    onClick={clearAll}
                >
                    Clear
                </button>

            </div>

            <button
                className="event-admin-create"
                onClick={generateTeams}
            >
                Generate Matchups
            </button>

            <br />
            <br />

            {groups.length > 0 && (
                <>
                    <h2>Generated Teams</h2>

                    <div className="event-admin-list">
                        {groups.map((group) => (
                            <div
                                key={group.name}
                                className="event-admin-card"
                            >
                                <div className="event-admin-header">
                                    <strong>{group.name}</strong>
                                </div>

                                <div className="event-admin-panel">
                                    <div className="event-admin-grid">

                                        {group.members.map((userid) => {
                                            const user = users.find(
                                                (u) => u.userid === userid
                                            );

                                            return (
                                                <div
                                                    key={userid}
                                                    className={`event-admin-player house-${(user?.house ?? "default")
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9]+/g, "-")}`}                                                >
                                                    {user?.firstname} {user?.lastname}
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}