alert("hello");
(function() {
    'use strict';
    window.addEventListener('load', function() {
      var form = document.getElementById('inventoryForm');
      form.addEventListener('submit', function(event) {
        // if (form.checkValidity() === false) {
        //   event.preventDefault();
        //   event.stopPropagation();
        // }
        if (form.checkValidity() === false) {
          // If invalid, show validation feedback
          form.classList.add('was-validated');
        } 
        else {
          // If valid, show validation feedback
          form.classList.add('was-validated');
          alert('Đã nộp. Kéo xuống để nộp tiếp.')
          // Optionally, you can provide an additional prompt or button for reloading:
          const reloadButton = document.createElement('button');
          reloadButton.textContent = "Reload Page";
          reloadButton.classList.add('btn', 'btn-primary'); // Optional: Bootstrap styling
          reloadButton.addEventListener('click', function() {
              location.reload(); // Manually reload the page when the button is clicked
          });
  
          document.body.appendChild(reloadButton); // Append button to the page
      }
        // form.classList.add('was-validated');
      }, false);
    }, false);
  })();

  window.onload = function() {
    fetch('http://192.168.111.19:8000/get-tenVT',{
        method: 'GET',
        headers: {
        accept: 'application/json',
      },

    })
        .then(response => response.json())
        .then(data => {
            const tenVTSelect = document.getElementById('tenVT');
            data.tenVT.forEach(tenVT => {
                const option = document.createElement('option');
                option.value = tenVT;
                option.textContent = tenVT;
                tenVTSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching tenVT:', error));
        
};
$('#tenVT').select2({
    placeholder: "Select or type to search",
    allowClear: true
})
// Fetch MaVT and DVT when a tenVT is selected
function fetchMaVTandDVT() {
    const tenVT = document.getElementById('tenVT').value;
    console.log(tenVT)
    if (tenVT) {
        fetch(`http://192.168.111.19:8000/get-mavt-dvt?tenVT=${encodeURIComponent(tenVT)}`, {
            method: 'GET',
            headers: {
            accept: 'application/json'
        },
    })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                document.getElementById('maVT').value = data.MaVT;
                document.getElementById('dvt').value = data.DVT;
            })
            .catch(error => console.error('Error fetching MaVT and DVT:', error));
    } else {
        document.getElementById('maVT').value = "";
        document.getElementById('dvt').value = "";
    }
}
  // Auto-fill Ngày nhập, xuất
  document.getElementById('ngayNhap').value = new Date().toISOString().slice(0, 16);
  document.getElementById('ngayXuat').value = new Date().toISOString().slice(0, 16);

  // Upload image to Imgbb
  function uploadImage() {
    const fileInput = document.getElementById('chungTuMua');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    fetch('https://api.imgbb.com/1/upload?key=135ca2616b94d6843db38cdee12cf353', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('imgbbUrl').value = data.data.url;
      console.log('Image uploaded successfully');
    })
    .catch(error => console.error('Lỗi tải ảnh, vui lòng tải lại:', error));
  }
  function sendFormData() {
    const formData = {
        ngayNhap: document.getElementById('ngayNhap').value,
        stt: document.getElementById('stt').value,
        tenVT: document.getElementById('tenVT').value,
        maVT: document.getElementById('maVT').value,
        dvt: document.getElementById('dvt').value,
        xuat: document.getElementById('xuat').value,
        nhap: document.getElementById('nhap').value,
        nguoiNhap: document.getElementById('nguoiNhap').value,
        nguoiXuat: document.getElementById('nguoiXuat').value,
        ngayXuat: document.getElementById('ngayXuat').value,
        soLo: document.getElementById('soLo').value,
        nhap: document.getElementById('nhap').value,
        imgURL: document.getElementById('imgbbUrl').value,
        tinhTrang: document.getElementById('tinhTrang').value,
        ghiChu: document.getElementById('ghiChu').value,
        
        // Add other fields as needed
    };

    // Convert form data to JSON and send as GET request
    fetch('http://192.168.111.19:8000/nhapkho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Gửi không thành công, vui lòng thử lại.'); // Alert on failure
    });
}

document.getElementById('tinhTrang').addEventListener('change', function () {
  const customOption = document.getElementById('tinhTrang').value === 'custom';
  const customField = document.getElementById('customTinhTrangField');
  
  // Show or hide the custom input field based on the selection
  if (customOption) {
      customField.style.display = 'block'; // Show the input field
      document.getElementById('customTinhTrang').setAttribute('required', true); // Make custom input required
  } else {
      customField.style.display = 'none'; // Hide the input field
      document.getElementById('customTinhTrang').removeAttribute('required'); // Remove the required attribute
  }
});

document.getElementById('nhap').addEventListener('change', function() {
  const nguoiNhap = document.getElementById('nguoiNhap');
  const ngayNhap = document.getElementById('ngayNhap');
  if (this.value) {
    nguoiNhap.required = true;
    ngayNhap.required = true;
  } else {
    nguoiNhap.required = false;
    ngayNhap.required = false;
  }
});

// Similar code for xuat (SL xuất) field
document.getElementById('xuat').addEventListener('change', function() {
  const nguoiXuat = document.getElementById('nguoiXuat');
  const ngayXuat = document.getElementById('ngayXuat');
  if (this.value) {
    nguoiXuat.required = true;
    ngayXuat.required = true; // typo fixed (should be ngayXuat)
  } else {
    nguoiXuat.required = false;
    ngayXuat.required = false;
  }
});
