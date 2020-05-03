using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ConstantRotation : MonoBehaviour
{
    [SerializeField] Vector3 rotationSpeed;

    void Update()
    {
        transform.Rotate(rotationSpeed);
    }
}