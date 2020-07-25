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
    }


    private void OnDisable()
    {
        NetworkManager.OnReceiveRole -= OnReceiveRole;
        NetworkManager.OnDeadPlayerList -= OnDeadPlayerList;
    }

    public void OnReceiveRole(RoleData roleData)
    {
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
}