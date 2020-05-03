using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using UnityEngine.EventSystems;

public class Player : MonoBehaviour
{
    public string ID;
    public string Name;
    public bool isMine = true;
    public bool Alive = true;
    public PlayerRoles Role;
    public static Player Instance;

    private void Awake()
    {
        if(isMine)
        {
            Instance = this;
        }
    }

    private void OnEnable()
    {
        NetworkManager.OnReceiveRole += onReceiveRole;
    }

    private void OnDisable()
    {
        NetworkManager.OnReceiveRole -= onReceiveRole;
    }

    void onReceiveRole(PlayerRoles role)
    {
        Role = role;
    }
}