using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class RoleDescriptionText : MonoBehaviour
{
    public RoleDescriptionData roleDescriptionData;

    [SerializeField] Text roleDescriptionText;

    private void OnEnable()
    {
        roleDescriptionData = JsonUtility.FromJson<RoleDescriptionData>(Resources.Load<TextAsset>("Descriptions/role-descriptions").text);
        NetworkManager.OnReceiveRole += OnReceiveRole;
    }

    private void OnDisable()
    {
        NetworkManager.OnReceiveRole -= OnReceiveRole;
    }

    void OnReceiveRole(RoleData roleData)
    {
        roleDescriptionText.text = roleDescriptionData.roles[int.Parse(roleData.id)].description;
    }
}

[System.Serializable]
public class RoleDescriptionData
{
    public List<RoleDescriptionEntry> roles;
}

[System.Serializable]
public class RoleDescriptionEntry
{
    public string name;
    public string description;
}