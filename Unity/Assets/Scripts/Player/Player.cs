using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    public string ID;
    public string Name;
    public bool isMine = true;
    public bool Alive = true;
    public PlayerRoles Role;
    public bool isEvil = false;

    public static Player Instance;


    public Action OnPlayerDied;

    private void Awake()
    {
        if(isMine)
        {
            Instance = this;
        }
    }

    private void OnEnable()
    {
        NetworkManager.OnReceiveRole += OnReceiveRole;
        NetworkManager.OnDeadPlayerList += OnDeadPlayerList;
        NetworkManager.OnVotedPlayerList += OnVotedPlayerList;
        NetworkManager.OnPlayerAlignment += OnPlayerAlignment;
    }


    private void OnDisable()
    {
        NetworkManager.OnReceiveRole -= OnReceiveRole;
        NetworkManager.OnDeadPlayerList -= OnDeadPlayerList;
        NetworkManager.OnVotedPlayerList -= OnVotedPlayerList;
        NetworkManager.OnPlayerAlignment += OnPlayerAlignment;
    }

    public void OnReceiveRole(RoleData roleData)
    {
        if(isMine)
            Role = (PlayerRoles)int.Parse(roleData.id);
    }

    private void OnDeadPlayerList(DeadPlayerData data)
    {
        if(data.deadPlayersId.Contains(ID))
        {
            Alive = false;
            OnPlayerDied?.Invoke();
        }
    }

    private void OnVotedPlayerList(VotedPlayerData data)
    {
        if (data.votedPlayersId.Contains(ID))
        {
            Alive = false;
            OnPlayerDied?.Invoke();
        }
    }

    public void OnPlayerAlignment(PlayerAlignmentsData data)
    {
        for(int i = 0; i < data.playersID.Length; i++)
        {
            if(data.playersID[i] == ID)
            {
                isEvil = true;
            }
        }
    }
}