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
    [SerializeField] NavMeshAgent navMeshAgent;
    [SerializeField] Transform camera;

    void Start()
    {
        StartCoroutine(SendPosDataRoutine());
    }

    private void OnEnable()
    {
        if(!isMine)
        {
            NetworkManager.OnPlayerPosition += OnPlayerPosition;
        }
    }

    private void OnDisable()
    {
        if (!isMine)
        {
            NetworkManager.OnPlayerPosition -= OnPlayerPosition;
        }
    }

    private void OnPlayerPosition(PlayerPositionData data)
    {
        transform.position = data.position;
        transform.rotation = data.rotation;
    }

    private void Update()
    {
        if(isMine)
        {
            if(!EventSystem.current.IsPointerOverGameObject())
            {

                if(Input.GetMouseButtonDown(0))
                {
                    RaycastHit hit;
                    if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit))
                    {
                        navMeshAgent.SetDestination(hit.point);
                    }
                }
            }

            camera.transform.position = new Vector3(transform.position.x + 2.52f, transform.position.y + 4.867f, transform.position.z);
        }
    }

    IEnumerator SendPosDataRoutine()
    {
        while(true)
        {
            yield return new WaitForSeconds(1 / 5);
            NetworkManager.SendEmitMessage("player-position", JsonUtility.ToJson(new PlayerPositionData(ID, transform.position, transform.rotation)));
        }
    }
}